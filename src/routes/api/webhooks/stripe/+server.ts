import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { bookings, grills, packages, stripeEvents } from '$lib/server/db/schema';
import { eq, and, notInArray, ne } from 'drizzle-orm';
import { stripe } from '$lib/server/stripe';
import { env } from '$lib/server/env';
import { sendBookingConfirmation } from '$lib/server/email';
import { createBookingEvent } from '$lib/server/google-calendar';
import type Stripe from 'stripe';

export async function POST({ request }) {
	const rawBody = await request.text();
	const sig = request.headers.get('stripe-signature');

	if (!sig) {
		return json({ error: 'Missing stripe-signature header' }, { status: 400 });
	}

	let event: Stripe.Event;
	try {
		event = stripe.webhooks.constructEvent(rawBody, sig, env.STRIPE_WEBHOOK_SECRET);
	} catch (err) {
		console.error('Webhook signature verification failed:', err);
		return json({ error: 'Invalid signature' }, { status: 400 });
	}

	// Idempotency: skip already-processed events
	const [seen] = await db.select().from(stripeEvents).where(eq(stripeEvents.id, event.id)).limit(1);
	if (seen) {
		return json({ received: true, idempotent: true });
	}

	try {
		switch (event.type) {
			case 'checkout.session.completed':
				await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
				break;
			case 'checkout.session.expired':
				await handleCheckoutExpired(event.data.object as Stripe.Checkout.Session);
				break;
			case 'charge.refunded':
				await handleChargeRefunded(event.data.object as Stripe.Charge);
				break;
			default:
				// Ignore unhandled types but still record so we don't re-process
				break;
		}

		await db.insert(stripeEvents).values({ id: event.id, type: event.type });
	} catch (err) {
		console.error(`Error handling ${event.type}:`, err);
		return json({ error: 'Handler failed' }, { status: 500 });
	}

	return json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
	const bookingId = parseInt(session.metadata?.bookingId ?? '0');
	const reference = session.metadata?.reference;
	if (!bookingId) return;

	const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : null;

	await db
		.update(bookings)
		.set({
			paymentStatus: 'paid',
			status: 'confirmed',
			stripePaymentIntentId: paymentIntentId,
			updatedAt: new Date()
		})
		.where(eq(bookings.id, bookingId));

	// Assign a grill if not already assigned
	const [booking] = await db.select().from(bookings).where(eq(bookings.id, bookingId)).limit(1);
	if (!booking) return;

	if (!booking.grillId) {
		const bookedRows = await db
			.select({ grillId: bookings.grillId })
			.from(bookings)
			.where(
				and(
					eq(bookings.rentalDate, booking.rentalDate),
					notInArray(bookings.status, ['cancelled', 'payment_failed']),
					ne(bookings.id, bookingId)
				)
			);
		const bookedGrillIds = bookedRows.map((b) => b.grillId).filter((id): id is number => id !== null);

		const activeGrills = await db.select().from(grills).where(eq(grills.active, true));
		const availableGrill = activeGrills.find((g) => !bookedGrillIds.includes(g.id));

		if (availableGrill) {
			await db
				.update(bookings)
				.set({ grillId: availableGrill.id })
				.where(eq(bookings.id, bookingId));
			booking.grillId = availableGrill.id;
		}
	}

	// Idempotency guard for email
	if (!booking.confirmationEmailSentAt) {
		await sendBookingConfirmation(booking);
		await db
			.update(bookings)
			.set({ confirmationEmailSentAt: new Date() })
			.where(eq(bookings.id, bookingId));
	}

	// Write to Google Calendar (non-blocking, errors are logged but don't throw)
	const [pkg] = await db.select({ name: packages.name }).from(packages).where(eq(packages.id, booking.packageId)).limit(1);
	await createBookingEvent({
		reference: booking.reference,
		customerName: booking.customerName,
		customerEmail: booking.customerEmail,
		customerPhone: booking.customerPhone,
		rentalDate: booking.rentalDate,
		packageName: pkg?.name ?? 'Pakket',
		guestCount: booking.guestCount,
		eventType: booking.eventType,
		notes: booking.notes,
		totalAmount: booking.totalAmount
	});

	console.log(`✅ Booking ${reference} confirmed via Stripe webhook`);
}

async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
	const bookingId = parseInt(session.metadata?.bookingId ?? '0');
	if (!bookingId) return;

	await db
		.update(bookings)
		.set({ status: 'cancelled', paymentStatus: 'failed', grillId: null, updatedAt: new Date() })
		.where(and(eq(bookings.id, bookingId), eq(bookings.status, 'reserved')));

	console.log(`⏰ Booking ${session.metadata?.reference} expired (checkout session)`);
}

async function handleChargeRefunded(charge: Stripe.Charge) {
	const paymentIntentId = typeof charge.payment_intent === 'string' ? charge.payment_intent : null;
	if (!paymentIntentId) return;

	await db
		.update(bookings)
		.set({
			paymentStatus: 'refunded',
			status: 'cancelled',
			depositRefunded: true,
			updatedAt: new Date()
		})
		.where(eq(bookings.stripePaymentIntentId, paymentIntentId));

	console.log(`💸 Refund processed for payment intent ${paymentIntentId}`);
}
