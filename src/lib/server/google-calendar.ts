import { google } from 'googleapis';
import { env } from '$lib/server/env';

function getCalendarClient() {
	if (!env.GOOGLE_SERVICE_ACCOUNT_JSON || !env.GOOGLE_CALENDAR_ID) return null;

	try {
		const credentials = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON);
		const auth = new google.auth.GoogleAuth({
			credentials,
			scopes: ['https://www.googleapis.com/auth/calendar']
		});
		return { calendar: google.calendar({ version: 'v3', auth }), calendarId: env.GOOGLE_CALENDAR_ID };
	} catch (err) {
		console.error('[Google Calendar] Failed to initialize client:', err);
		return null;
	}
}

export interface BookingEventData {
	reference: string;
	customerName: string;
	customerEmail: string;
	customerPhone: string;
	rentalDate: string; // ISO date YYYY-MM-DD
	packageName: string;
	guestCount?: number | null;
	eventType?: string | null;
	notes?: string | null;
	totalAmount: number; // cents
}

export async function createBookingEvent(booking: BookingEventData): Promise<void> {
	const client = getCalendarClient();
	if (!client) return;

	const { calendar, calendarId } = client;

	const totalEur = (booking.totalAmount / 100).toFixed(2).replace('.', ',');
	const description = [
		`📋 Referentie: ${booking.reference}`,
		`👤 Klant: ${booking.customerName}`,
		`📧 E-mail: ${booking.customerEmail}`,
		`📞 Telefoon: ${booking.customerPhone}`,
		booking.guestCount ? `👥 Gasten: ~${booking.guestCount}` : null,
		booking.eventType ? `🎉 Feest: ${booking.eventType}` : null,
		`💶 Betaald: €${totalEur}`,
		booking.notes ? `📝 Notities: ${booking.notes}` : null
	]
		.filter(Boolean)
		.join('\n');

	try {
		await calendar.events.insert({
			calendarId,
			requestBody: {
				summary: `${booking.reference} – ${booking.customerName} – ${booking.packageName}`,
				description,
				start: { date: booking.rentalDate },
				end: { date: booking.rentalDate },
				colorId: '9' // blueberry — stands out
			}
		});
		console.log(`[Google Calendar] Event created for ${booking.reference}`);
	} catch (err) {
		console.error(`[Google Calendar] Failed to create event for ${booking.reference}:`, err);
	}
}

export async function getBlockedDatesForMonth(year: number, month: number): Promise<string[]> {
	const client = getCalendarClient();
	if (!client) return [];

	const { calendar, calendarId } = client;

	// First and last day of the month
	const timeMin = new Date(year, month, 1).toISOString();
	const timeMax = new Date(year, month + 1, 0, 23, 59, 59).toISOString();

	try {
		const res = await calendar.events.list({
			calendarId,
			timeMin,
			timeMax,
			singleEvents: true,
			orderBy: 'startTime'
		});

		const events = res.data.items ?? [];
		const blockedDates: string[] = [];

		for (const event of events) {
			const title = event.summary ?? '';
			if (title.match(/^VB-\d{4}-\d{4}/)) continue; // skip our own booking events

			// Get the date (all-day events use event.start.date, timed events use event.start.dateTime)
			const dateStr = event.start?.date ?? event.start?.dateTime?.slice(0, 10);
			if (dateStr) blockedDates.push(dateStr);
		}

		return blockedDates;
	} catch (err) {
		console.error('[Google Calendar] Failed to fetch events:', err);
		return [];
	}
}
