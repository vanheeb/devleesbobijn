import { db } from '$lib/server/db';
import { bookings, packages } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function load() {
	const allBookings = await db
		.select({
			id: bookings.id,
			reference: bookings.reference,
			rentalDate: bookings.rentalDate,
			customerName: bookings.customerName,
			customerEmail: bookings.customerEmail,
			customerPhone: bookings.customerPhone,
			status: bookings.status,
			paymentStatus: bookings.paymentStatus,
			totalAmount: bookings.totalAmount,
			deposit: bookings.deposit,
			packageName: packages.name,
			createdAt: bookings.createdAt
		})
		.from(bookings)
		.leftJoin(packages, eq(bookings.packageId, packages.id))
		.orderBy(desc(bookings.createdAt));

	return { bookings: allBookings };
}
