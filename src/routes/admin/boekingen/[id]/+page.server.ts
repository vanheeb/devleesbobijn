import { db } from '$lib/server/db';
import { bookings, packages, bookingExtras, extras, grills } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error, fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export async function load({ params }) {
	const bookingId = parseInt(params.id);
	if (isNaN(bookingId)) throw error(404);

	const [booking] = await db.select().from(bookings).where(eq(bookings.id, bookingId)).limit(1);
	if (!booking) throw error(404, 'Boeking niet gevonden');

	const [pkg] = await db.select().from(packages).where(eq(packages.id, booking.packageId)).limit(1);

	const bExtras = await db
		.select({
			name: extras.name,
			quantity: bookingExtras.quantity,
			unitPrice: bookingExtras.unitPrice,
			unit: extras.unit
		})
		.from(bookingExtras)
		.innerJoin(extras, eq(bookingExtras.extraId, extras.id))
		.where(eq(bookingExtras.bookingId, bookingId));

	let grillName = 'Niet toegewezen';
	if (booking.grillId) {
		const [grill] = await db.select().from(grills).where(eq(grills.id, booking.grillId)).limit(1);
		grillName = grill?.name ?? grillName;
	}

	return {
		booking,
		packageName: pkg?.name || 'Onbekend',
		extras: bExtras,
		grillName
	};
}

const VALID_STATUSES = [
	'pending',
	'reserved',
	'confirmed',
	'picked_up',
	'returned',
	'completed',
	'cancelled',
	'payment_failed'
] as const;
type BookingStatus = (typeof VALID_STATUSES)[number];

export const actions = {
	updateStatus: async ({ request, params }) => {
		const formData = await request.formData();
		const newStatus = formData.get('status') as string;
		const bookingId = parseInt(params.id);

		if (!VALID_STATUSES.includes(newStatus as BookingStatus)) {
			return fail(400, { error: 'Ongeldige status' });
		}

		await db
			.update(bookings)
			.set({ status: newStatus as BookingStatus, updatedAt: new Date() })
			.where(eq(bookings.id, bookingId));

		return { success: true };
	}
} satisfies Actions;
