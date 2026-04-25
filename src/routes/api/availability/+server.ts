import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { grills, bookings, blockedDates } from '$lib/server/db/schema';
import { eq, and, between, notInArray, sql } from 'drizzle-orm';
import { z } from 'zod';
import { bookingConfig } from '$lib/config';
import { getBlockedDatesForMonth } from '$lib/server/google-calendar';

const querySchema = z.object({
	month: z.coerce.number().int().min(0).max(11),
	year: z.coerce.number().int().min(2020).max(2100)
});

export async function GET({ url, setHeaders }) {
	const parsed = querySchema.safeParse({
		month: url.searchParams.get('month'),
		year: url.searchParams.get('year')
	});
	if (!parsed.success) {
		return json({ error: 'Invalid month or year' }, { status: 400 });
	}
	const { month, year } = parsed.data;

	// Reject requests too far in the future
	const maxDate = new Date();
	maxDate.setMonth(maxDate.getMonth() + bookingConfig.maxAdvanceMonths);
	const requestedMonth = new Date(year, month, 1);
	if (requestedMonth > maxDate) {
		return json({ error: 'Out of range' }, { status: 400 });
	}

	const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
	const lastDay = new Date(year, month + 1, 0).getDate();
	const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

	const [activeGrills, bookingCounts, blocked, calendarBlocked] = await Promise.all([
		db.select().from(grills).where(eq(grills.active, true)),
		db
			.select({
				date: bookings.rentalDate,
				count: sql<number>`count(*)::int`.as('count')
			})
			.from(bookings)
			.where(
				and(
					between(bookings.rentalDate, startDate, endDate),
					notInArray(bookings.status, ['cancelled', 'payment_failed'])
				)
			)
			.groupBy(bookings.rentalDate),
		db.select().from(blockedDates).where(between(blockedDates.date, startDate, endDate)),
		getBlockedDatesForMonth(year, month)
	]);

	const totalGrills = activeGrills.length;

	const bookingCountByDate: Record<string, number> = {};
	for (const row of bookingCounts) {
		bookingCountByDate[row.date] = row.count;
	}

	const availability: Record<string, { available: number; total: number }> = {};
	for (let day = 1; day <= lastDay; day++) {
		const date = new Date(year, month, day);
		const dateStr = date.toISOString().slice(0, 10);

		const ownBookings = bookingCountByDate[dateStr] ?? 0;
		const blockedForDay = blocked.filter((b) => b.date === dateStr);
		const dbBlocksAll = blockedForDay.some((b) => b.grillId === null);
		const dbSpecificBlocked = blockedForDay.filter((b) => b.grillId !== null).length;
		const calendarBlockCount = calendarBlocked.filter((d) => d === dateStr).length;

		let occupied: number;
		if (dbBlocksAll) {
			occupied = totalGrills;
		} else {
			occupied = Math.min(totalGrills, ownBookings + dbSpecificBlocked + calendarBlockCount);
		}

		availability[dateStr] = { available: Math.max(0, totalGrills - occupied), total: totalGrills };
	}

	setHeaders({ 'cache-control': 'no-store' });
	return json(availability);
}
