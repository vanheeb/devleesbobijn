import { db } from '$lib/server/db';
import { packages } from '$lib/server/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function load() {
	const allPackages = await db
		.select()
		.from(packages)
		.where(eq(packages.active, true))
		.orderBy(asc(packages.sortOrder));

	return { packages: allPackages };
}
