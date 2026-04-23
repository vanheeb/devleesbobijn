import { db } from '$lib/server/db';
import { bookings, packages } from '$lib/server/db/schema';
import { eq, gte, and, notInArray, sql } from 'drizzle-orm';

export async function load() {
	const today = new Date().toISOString().split('T')[0];

	const upcomingBookings = await db
		.select({
			id: bookings.id,
			reference: bookings.reference,
			rentalDate: bookings.rentalDate,
			customerName: bookings.customerName,
			customerPhone: bookings.customerPhone,
			status: bookings.status,
			paymentStatus: bookings.paymentStatus,
			totalAmount: bookings.totalAmount,
			packageName: packages.name
		})
		.from(bookings)
		.leftJoin(packages, eq(bookings.packageId, packages.id))
		.where(and(gte(bookings.rentalDate, today), notInArray(bookings.status, ['cancelled'])))
		.orderBy(bookings.rentalDate)
		.limit(10);

	const [totalRow] = await db
		.select({ count: sql<number>`count(*)::int` })
		.from(bookings)
		.where(notInArray(bookings.status, ['cancelled']));

	const [confirmedRow] = await db
		.select({ count: sql<number>`count(*)::int` })
		.from(bookings)
		.where(eq(bookings.status, 'confirmed'));

	const [todayRow] = await db
		.select({ count: sql<number>`count(*)::int` })
		.from(bookings)
		.where(and(eq(bookings.rentalDate, today), notInArray(bookings.status, ['cancelled'])));

	return {
		upcomingBookings,
		stats: {
			total: totalRow?.count ?? 0,
			confirmed: confirmedRow?.count ?? 0,
			today: todayRow?.count ?? 0
		}
	};
}
