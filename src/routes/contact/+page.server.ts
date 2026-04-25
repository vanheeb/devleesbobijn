import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import { db } from '$lib/server/db';
import { contactMessages } from '$lib/server/db/schema';
import { sendContactNotification, sendContactAutoReply } from '$lib/server/email';
import type { Actions } from './$types';

const contactSchema = z.object({
	name: z.string().min(2, 'Naam is te kort').max(120),
	email: z.string().email('Ongeldig e-mailadres'),
	phone: z.string().max(30).optional().nullable(),
	subject: z.string().max(200).optional().nullable(),
	message: z.string().min(5, 'Bericht is te kort').max(2000),
	// Honeypot: bots fill this, humans don't (field is hidden via CSS)
	website: z.string().max(0, 'Bot detected').optional().default(''),
	// Time-gate: form must have been on page for > 3 seconds
	formLoadedAt: z.coerce.number().int().positive()
});

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const raw = {
			name: formData.get('name'),
			email: formData.get('email'),
			phone: formData.get('phone') || null,
			subject: formData.get('subject') || null,
			message: formData.get('message'),
			website: formData.get('website') || '',
			formLoadedAt: formData.get('formLoadedAt')
		};

		const parsed = contactSchema.safeParse(raw);
		if (!parsed.success) {
			const firstIssue = parsed.error.issues[0];
			return fail(400, { error: firstIssue.message, field: firstIssue.path.join('.') });
		}

		const data = parsed.data;

		// Anti-spam: honeypot
		if (data.website.length > 0) {
			// Silently accept to avoid giving feedback to bots
			return { success: true };
		}

		// Anti-spam: time-gate (< 3s since page load = likely bot)
		if (Date.now() - data.formLoadedAt < 3000) {
			return { success: true };
		}

		// Persist + notify
		try {
			await db.insert(contactMessages).values({
				name: data.name.trim(),
				email: data.email.trim().toLowerCase(),
				phone: data.phone?.trim() || null,
				subject: data.subject?.trim() || null,
				message: data.message.trim()
			});

			// Emails zijn non-blocking: fout in verzending blokkeert de submit niet
			Promise.all([
				sendContactNotification(data),
				sendContactAutoReply({ name: data.name, email: data.email })
			]).catch((err) => console.error('Contact email failed:', err));

			return { success: true };
		} catch (err) {
			console.error('Contact submission error:', err);
			return fail(500, { error: 'Er ging iets mis. Probeer opnieuw of bel ons.' });
		}
	}
} satisfies Actions;
