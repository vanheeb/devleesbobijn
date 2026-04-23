import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { bookings, bookingExtras, packages, extras, grills, blockedDates } from '$lib/server/db/schema';
import { eq, and, notInArray, inArray, sql, gte } from 'drizzle-orm';
import { stripe } from '$lib/server/stripe';
import { env } from '$lib/server/env';
import { pricingConfig, bookingConfig } from '$lib/config';
import { z } from 'zod';

const checkoutSchema = z.object({
	packageId: z.number().int().positive(),
	rentalDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Ongeldige datum'),
	extras: z
		.array(
			z.object({
				extraId: z.number().int().positive(),
				quantity: z.number().int().positive()
			})
		)
		.optional()
		.default([]),
	customerName: z.string().min(2).max(120),
	customerEmail: z.string().email(),
	customerPhone: z
		.string()
		.min(6)
		.max(30)
		.regex(/^[+\d\s().-]+$/, 'Ongeldig telefoonnummer'),
	customerAddress: z.string().max(200).optional().nullable(),
	customerCity: z.string().max(100).optional().nullable(),
	eventType: z.string().max(50).optional().nullable(),
	guestCount: z.number().int().positive().max(500).optional().nullable(),
	notes: z.string().max(1000).optional().nullable(),
	acceptedTerms: z.literal(true, {
		errorMap: () => ({ message: 'Je moet de huurvoorwaarden aanvaarden.' })
	}),
	acceptedPrivacy: z.literal(true, {
		errorMap: () => ({ message: 'Je moet akkoord gaan met de privacyverklaring.' })
	})
});

async function generateReference(): Promise<string> {
	const year = new Date().getFullYear();
	const [row] = await db
		.select({ count: sql<number>`count(*)::int` })
		.from(bookings)
		.where(sql`extract(year from ${bookings.createdAt}) = ${year}`);
	const num = (row?.count ?? 0) + 1;
	return `VB-${year}-${String(num).padStart(4, '0')}`;
}

export async function POST({ request, url }) {
	let body;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Ongeldige request body.' }, { status: 400 });
	}

	const parsed = checkoutSchema.safeParse(body);
	if (!parsed.success) {
		const firstIssue = parsed.error.issues[0];
		return json(
			{ error: firstIssue.message, field: firstIssue.path.join('.') },
			{ status: 400 }
		);
	}

	const data = parsed.data;

	// Validate rental date is in the future (minimum notice)
	const rentalDate = new Date(data.rentalDate);
	const minDate = new Date();
	minDate.setDate(minDate.getDate() + bookingConfig.minAdvanceDays);
	if (rentalDate < minDate) {
		return json(
			{ error: `Boek minstens ${bookingConfig.minAdvanceDays} dagen op voorhand.` },
			{ status: 400 }
		);
	}

	// Fetch package
	const [pkg] = await db.select().from(packages).where(eq(packages.id, data.packageId)).limit(1);
	if (!pkg || !pkg.active) {
		return json({ error: 'Ongeldig pakket.' }, { status: 400 });
	}

	// Concurrency-safe availability check + grill reservation in a transaction
	const reservation = await db.transaction(async (tx) => {
		// Active grills (lock)
		const activeGrills = await tx
			.select()
			.from(grills)
			.where(eq(grills.active, true))
			.for('update');

		// Blocked dates for this date
		const blocked = await tx
			.select()
			.from(blockedDates)
			.where(eq(blockedDates.date, data.rentalDate));
		const blockedAll = blocked.some((b) => b.grillId === null);
		if (blockedAll) return { error: 'Deze datum is niet beschikbaar.' };
		const blockedGrillIds = blocked.map((b) => b.grillId).filter((id): id is number => id !== null);

		// Existing non-cancelled bookings on this date
		const existing = await tx
			.select({ grillId: bookings.grillId, reservedUntil: bookings.reservedUntil })
			.from(bookings)
			.where(
				and(
					eq(bookings.rentalDate, data.rentalDate),
					notInArray(bookings.status, ['cancelled', 'payment_failed'])
				)
			)
			.for('update');

		const now = new Date();
		const takenGrillIds = existing
			.filter((b) => !(b.reservedUntil && b.reservedUntil < now)) // ignore expired reservations
			.map((b) => b.grillId)
			.filter((id): id is number => id !== null);

		const availableGrill = activeGrills.find(
			(g) => !takenGrillIds.includes(g.id) && !blockedGrillIds.includes(g.id)
		);

		if (!availableGrill) {
			return { error: 'Geen grill meer beschikbaar op deze datum.' };
		}

		// Calculate pricing
		let extrasTotal = 0;
		const extraItems: { extraId: number; quantity: number; unitPrice: number }[] = [];
		if (data.extras.length > 0) {
			const extraIds = data.extras.map((e) => e.extraId);
			const fetchedExtras = await tx
				.select()
				.from(extras)
				.where(inArray(extras.id, extraIds));
			for (const item of data.extras) {
				const extra = fetchedExtras.find((e) => e.id === item.extraId);
				if (extra && extra.active) {
					extrasTotal += extra.pricePerUnit * item.quantity;
					extraItems.push({
						extraId: extra.id,
						quantity: item.quantity,
						unitPrice: extra.pricePerUnit
					});
				}
			}
		}

		const totalAmount = pkg.price + extrasTotal;
		const deposit = pricingConfig.depositCents;
		const reference = await generateReference();
		const reservedUntil = new Date(Date.now() + bookingConfig.reservationTtlMinutes * 60 * 1000);

		const [inserted] = await tx
			.insert(bookings)
			.values({
				reference,
				grillId: availableGrill.id,
				packageId: data.packageId,
				rentalDate: data.rentalDate,
				customerName: data.customerName.trim(),
				customerEmail: data.customerEmail.trim().toLowerCase(),
				customerPhone: data.customerPhone.trim(),
				customerAddress: data.customerAddress || null,
				customerCity: data.customerCity || null,
				eventType: data.eventType || null,
				guestCount: data.guestCount || null,
				notes: data.notes || null,
				acceptedTerms: data.acceptedTerms,
				acceptedPrivacy: data.acceptedPrivacy,
				packagePrice: pkg.price,
				extrasTotal,
				deposit,
				totalAmount,
				status: 'reserved',
				paymentStatus: 'pending',
				reservedUntil
			})
			.returning({ id: bookings.id, reference: bookings.reference });

		if (extraItems.length > 0) {
			await tx.insert(bookingExtras).values(
				extraItems.map((item) => ({
					bookingId: inserted.id,
					extraId: item.extraId,
					quantity: item.quantity,
					unitPrice: item.unitPrice
				}))
			);
		}

		return { bookingId: inserted.id, reference: inserted.reference, deposit, totalAmount };
	});

	if ('error' in reservation) {
		return json({ error: reservation.error }, { status: 409 });
	}

	// Create Stripe Checkout Session
	try {
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card', 'bancontact'],
			line_items: [
				{
					price_data: {
						currency: 'eur',
						product_data: {
							name: `Voorschot - ${pkg.name}`,
							description: `Boeking ${reservation.reference} - ${data.rentalDate}`
						},
						unit_amount: reservation.deposit
					},
					quantity: 1
				}
			],
			mode: 'payment',
			success_url: `${url.origin}/boeken/bevestiging?ref=${reservation.reference}`,
			cancel_url: `${url.origin}/boeken?cancelled=true`,
			customer_email: data.customerEmail,
			expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 min
			metadata: {
				bookingId: String(reservation.bookingId),
				reference: reservation.reference
			}
		});

		await db
			.update(bookings)
			.set({ stripeSessionId: session.id })
			.where(eq(bookings.id, reservation.bookingId));

		return json({ url: session.url });
	} catch (err) {
		console.error('Stripe session error:', err);
		// Release the reservation so the slot can be used again
		await db
			.update(bookings)
			.set({ status: 'cancelled', paymentStatus: 'failed', grillId: null })
			.where(eq(bookings.id, reservation.bookingId));
		return json({ error: 'Betaling kon niet worden voorbereid. Probeer opnieuw.' }, { status: 500 });
	}
}
