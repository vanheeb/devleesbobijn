import { db } from '$lib/server/db';
import { blockedDates } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export async function load() {
	const blocked = await db.select().from(blockedDates);
	return { blockedDates: blocked };
}

export const actions = {
	block: async ({ request }) => {
		const formData = await request.formData();
		const date = formData.get('date') as string;
		const reason = formData.get('reason') as string;

		if (!date) return fail(400, { error: 'Selecteer een datum' });

		// Check if already blocked (all-grill block)
		const [existing] = await db
			.select()
			.from(blockedDates)
			.where(eq(blockedDates.date, date))
			.limit(1);

		if (existing) return fail(400, { error: 'Datum is al geblokkeerd' });

		await db.insert(blockedDates).values({
			date,
			grillId: null, // Block all grills
			reason: reason || 'Geblokkeerd door admin'
		});

		return { success: true };
	},

	unblock: async ({ request }) => {
		const formData = await request.formData();
		const id = parseInt(formData.get('id') as string);

		if (isNaN(id)) return fail(400, { error: 'Ongeldig ID' });

		await db.delete(blockedDates).where(eq(blockedDates.id, id));
		return { success: true };
	}
} satisfies Actions;
