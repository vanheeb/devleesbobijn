import { db } from '$lib/server/db';
import { packages, extras, grills } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export async function load() {
	const [allPackages, allExtras, allGrills] = await Promise.all([
		db.select().from(packages),
		db.select().from(extras),
		db.select().from(grills)
	]);

	return {
		packages: allPackages,
		extras: allExtras,
		grills: allGrills
	};
}

export const actions = {
	updatePackagePrice: async ({ request }) => {
		const formData = await request.formData();
		const packageId = parseInt(formData.get('packageId') as string);
		const priceEuros = parseFloat(formData.get('price') as string);

		if (isNaN(packageId) || isNaN(priceEuros)) {
			return fail(400, { error: 'Ongeldige invoer' });
		}

		await db
			.update(packages)
			.set({ price: Math.round(priceEuros * 100) })
			.where(eq(packages.id, packageId));

		return { success: true, message: 'Prijs bijgewerkt' };
	},

	updateExtraPrice: async ({ request }) => {
		const formData = await request.formData();
		const extraId = parseInt(formData.get('extraId') as string);
		const priceEuros = parseFloat(formData.get('price') as string);

		if (isNaN(extraId) || isNaN(priceEuros)) {
			return fail(400, { error: 'Ongeldige invoer' });
		}

		await db
			.update(extras)
			.set({ pricePerUnit: Math.round(priceEuros * 100) })
			.where(eq(extras.id, extraId));

		return { success: true, message: 'Prijs bijgewerkt' };
	},

	toggleGrill: async ({ request }) => {
		const formData = await request.formData();
		const grillId = parseInt(formData.get('grillId') as string);
		const active = formData.get('active') === 'true';

		if (isNaN(grillId)) return fail(400, { error: 'Ongeldig ID' });

		await db.update(grills).set({ active }).where(eq(grills.id, grillId));

		return { success: true, message: `Grill ${active ? 'geactiveerd' : 'gedeactiveerd'}` };
	}
} satisfies Actions;
