import { db } from '$lib/server/db';
import { packages, extras } from '$lib/server/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function load() {
	const [allPackages, allExtras] = await Promise.all([
		db.select().from(packages).where(eq(packages.active, true)).orderBy(asc(packages.sortOrder)),
		db.select().from(extras).where(eq(extras.active, true))
	]);

	return { packages: allPackages, extras: allExtras };
}
