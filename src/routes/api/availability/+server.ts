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

	// Extend by 1 day on each side to compute cross-month half-day buffers
	const extStart = new Date(year, month, 0).toISOString().slice(0, 10); // last day of prev month
	const extEnd = new Date(year, month + 1, 1).toISOString().slice(0, 10); // first day of next month

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
					between(bookings.rentalDate, extStart, extEnd),
					notInArray(bookings.status, ['cancelled', 'payment_failed'])
				)
			)
			.groupBy(bookings.rentalDate),
		db.select().from(blockedDates).where(between(blockedDates.date, startDate, endDate)),
		getBlockedDatesForMonth(year, month)
	]);

	const totalGrills = activeGrills.length;

	function getDateStr(d: Date) {
		return d.toISOString().slice(0, 10);
	}

	// First pass: compute raw booking counts per day (only actual bookings create buffer)
	const bookingCountByDate: Record<string, number> = {};
	for (const row of bookingCounts) {
		bookingCountByDate[row.date] = row.count;
	}

	// Second pass: build availability for each day of the month
	const availability: Record<string, { available: number; total: number; bufferSide: null | 'left' | 'right' | 'full' }> = {};
	for (let day = 1; day <= lastDay; day++) {
		const date = new Date(year, month, day);
		const dateStr = getDateStr(date);
		const prevStr = getDateStr(new Date(year, month, day - 1));
		const nextStr = getDateStr(new Date(year, month, day + 1));

		const ownBookings = bookingCountByDate[dateStr] ?? 0;
		const prevBuffer = bookingCountByDate[prevStr] ?? 0;
		const nextBuffer = bookingCountByDate[nextStr] ?? 0;

		const blockedForDay = blocked.filter((b) => b.date === dateStr);
		const dbBlocksAll = blockedForDay.some((b) => b.grillId === null);
		const dbSpecificBlocked = blockedForDay.filter((b) => b.grillId !== null).length;
		const calendarBlockCount = calendarBlocked.filter((d) => d === dateStr).length;

		let occupied: number;
		if (dbBlocksAll) {
			occupied = totalGrills;
		} else {
			occupied = Math.min(totalGrills, ownBookings + prevBuffer + nextBuffer + dbSpecificBlocked + calendarBlockCount);
		}

		const available = Math.max(0, totalGrills - occupied);
		const ownOccupied = dbBlocksAll ? totalGrills : Math.min(totalGrills, ownBookings + dbSpecificBlocked + calendarBlockCount);

		// bufferSide: only set when this day has no own occupancy and is limited by adjacent bookings
		let bufferSide: null | 'left' | 'right' | 'full' = null;
		if (!dbBlocksAll && ownOccupied === 0 && available < totalGrills) {
			const hasPrev = prevBuffer > 0;
			const hasNext = nextBuffer > 0;
			if (hasPrev && hasNext) bufferSide = 'full';
			else if (hasPrev) bufferSide = 'left';  // return day: left half colored
			else if (hasNext) bufferSide = 'right'; // prep day: right half colored
		}

		availability[dateStr] = { available, total: totalGrills, bufferSide };
	}

	setHeaders({ 'cache-control': 'no-store' });
	return json(availability);
}
