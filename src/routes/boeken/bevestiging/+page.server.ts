import { db } from '$lib/server/db';
import { bookings, packages } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export async function load({ url }) {
	const ref = url.searchParams.get('ref');
	if (!ref) throw error(404, 'Boeking niet gevonden');

	const [booking] = await db
		.select()
		.from(bookings)
		.where(eq(bookings.reference, ref))
		.limit(1);

	if (!booking) throw error(404, 'Boeking niet gevonden');

	const [pkg] = await db
		.select()
		.from(packages)
		.where(eq(packages.id, booking.packageId))
		.limit(1);

	return {
		booking: {
			reference: booking.reference,
			rentalDate: booking.rentalDate,
			customerName: booking.customerName,
			packageName: pkg?.name || 'Onbekend',
			totalAmount: booking.totalAmount,
			deposit: booking.deposit,
			status: booking.status,
			paymentStatus: booking.paymentStatus
		}
	};
}
