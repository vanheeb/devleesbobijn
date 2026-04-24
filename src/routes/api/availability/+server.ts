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

// Simple in-memory cache per process. TTL: 60s.
const cache = new Map<string, { data: Record<string, { available: number; total: number }>; expiresAt: number }>();
const CACHE_TTL_MS = 60_000;

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

	const cacheKey = `${year}-${month}`;
	const cached = cache.get(cacheKey);
	if (cached && cached.expiresAt > Date.now()) {
		setHeaders({ 'cache-control': 'public, max-age=30' });
		return json(cached.data);
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

	const availability: Record<string, { available: number; total: number }> = {};
	for (let day = 1; day <= lastDay; day++) {
		const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
		const bookingCount = bookingCounts.find((b) => b.date === dateStr)?.count ?? 0;
		const blockedForDay = blocked.filter((b) => b.date === dateStr);
		const allBlocked = blockedForDay.some((b) => b.grillId === null) || calendarBlocked.includes(dateStr);
		const specificBlocked = blockedForDay.filter((b) => b.grillId !== null).length;
		const blockedCount = allBlocked ? totalGrills : specificBlocked;
		const available = Math.max(0, totalGrills - bookingCount - blockedCount);
		availability[dateStr] = { available, total: totalGrills };
	}

	cache.set(cacheKey, { data: availability, expiresAt: Date.now() + CACHE_TTL_MS });
	setHeaders({ 'cache-control': 'public, max-age=30' });
	return json(availability);
}
