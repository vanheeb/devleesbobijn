import { db } from './index';
import { grills, packages, extras, adminUsers, faqItems } from './schema';
import { hash } from 'bcrypt';
import { env } from '$lib/server/env';

/**
 * Seed reference data (grills, packages, extras, faq) + bootstrap admin user if none exists.
 * Safe to re-run: uses "skip if exists" guards per table.
 */
export async function seed() {
	console.log('🌱 Seeding database...');

	// Grills (only seed if table empty)
	const existingGrills = await db.select().from(grills).limit(1);
	if (existingGrills.length === 0) {
		await db.insert(grills).values([
			{ name: 'Grill Alpha', type: 'both' },
			{ name: 'Grill Beta', type: 'both' },
			{ name: 'Grill Gamma', type: 'both' }
		]);
		console.log('  ✓ Grills seeded');
	}

	// Packages
	const existingPackages = await db.select().from(packages).limit(1);
	if (existingPackages.length === 0) {
		await db.insert(packages).values([
			// Chicken
			{ name: 'Pakket Kip 5kg', type: 'chicken', weightKg: 5, price: 25000, servesMin: 15, servesMax: 20, includes: 'Incl. 30 broodjes/durums', description: 'Perfect voor een klein feest. 5kg heerlijke kip aan het spit met alles erop en eraan.', sortOrder: 1 },
			{ name: 'Pakket Kip 10kg', type: 'chicken', weightKg: 10, price: 42000, servesMin: 30, servesMax: 40, includes: 'Incl. 60 broodjes/durums', description: 'De populairste keuze! 10kg kip voor een groter gezelschap.', sortOrder: 2 },
			{ name: 'Pakket Kip 15kg', type: 'chicken', weightKg: 15, price: 60000, servesMin: 45, servesMax: 60, includes: 'Incl. 90 broodjes/durums', description: 'Voor het ultieme feest. 15kg kip voor een groot gezelschap.', sortOrder: 3 },
			// Kebab
			{ name: 'Pakket Kebab 5kg', type: 'kebab', weightKg: 5, price: 26000, servesMin: 15, servesMax: 20, includes: 'Incl. 30 broodjes/durums', description: 'Authentieke kebab ervaring. 5kg kebab met alle toebehoren.', sortOrder: 4 },
			{ name: 'Pakket Kebab 10kg', type: 'kebab', weightKg: 10, price: 44000, servesMin: 30, servesMax: 40, includes: 'Incl. 60 broodjes/durums', description: 'Kebab voor het grote werk. 10kg voor een onvergetelijk feest.', sortOrder: 5 },
			{ name: 'Pakket Kebab 15kg', type: 'kebab', weightKg: 15, price: 63000, servesMin: 45, servesMax: 60, includes: 'Incl. 90 broodjes/durums', description: 'De ultieme kebab ervaring voor grote groepen.', sortOrder: 6 }
		]);
		console.log('  ✓ Packages seeded');
	}

	// Extras
	const existingExtras = await db.select().from(extras).limit(1);
	if (existingExtras.length === 0) {
		const sauces = [
			'Lookssaus', 'Cocktailsaus', 'Currysaus', 'Samuraisaus',
			'Andalousesaus', 'Tartaarsaus', 'Bearnaissaus',
			'Barbecuesaus', 'Hannibal saus', 'Mammoutsaus'
		];
		await db.insert(extras).values(
			sauces.map((name) => ({
				name,
				category: 'sauce' as const,
				unit: 'liter',
				pricePerUnit: 1000,
				description: `Huisgemaakte ${name.toLowerCase()}`
			}))
		);
		await db.insert(extras).values([
			{
				name: 'Kleine Pitamachine',
				category: 'equipment' as const,
				unit: 'stuk',
				pricePerUnit: 100,
				description: 'Extra kleine pitamachine voor bijverwarming'
			}
		]);
		console.log('  ✓ Extras seeded');
	}

	// FAQ items
	const existingFaq = await db.select().from(faqItems).limit(1);
	if (existingFaq.length === 0) {
		await db.insert(faqItems).values([
			{ question: 'Hoeveel personen kan ik voeden met één pakket?', answer: 'Een 5kg-pakket voedt 15-20 personen, een 10kg-pakket 30-40 personen en een 15kg-pakket 45-60 personen.', sortOrder: 1 },
			{ question: 'Wat is er inbegrepen in een pakket?', answer: 'Grill, vlees, broodjes/durums, snijmes en gasfles. Jij zorgt enkel voor de verse groenten en sauzen (of bestel deze extra bij ons).', sortOrder: 2 },
			{ question: 'Hoe werkt het afhalen en terugbrengen?', answer: 'Je haalt de grill op bij ons in Deerlijk (Achterstraat 20) op de afgesproken dag en brengt hem de dag nadien terug, proper gereinigd.', sortOrder: 3 },
			{ question: 'Moet ik een waarborg betalen?', answer: 'Ja, er is een waarborg van €250. Deze wordt volledig terugbetaald bij correcte en propere teruggave van de grill.', sortOrder: 4 },
			{ question: 'Wat als ik de grill niet gereinigd terugbreng?', answer: 'Dan rekenen we €100 reinigingskosten aan op de waarborg.', sortOrder: 5 },
			{ question: 'Kan ik ook enkel vlees bestellen zonder grill?', answer: 'Neen, wij verhuren steeds het volledige pakket (grill + vlees + broodjes).', sortOrder: 6 },
			{ question: 'Hoe ver op voorhand moet ik boeken?', answer: 'We raden aan minstens 2 weken op voorhand te boeken, zeker in het hoogseizoen (mei-september).', sortOrder: 7 },
			{ question: 'Kan ik mijn boeking annuleren?', answer: 'Annuleren kan tot 7 dagen voor de datum tegen volledige terugbetaling. Daarna houden we de waarborg in.', sortOrder: 8 }
		]);
		console.log('  ✓ FAQ items seeded');
	}

	// Bootstrap admin user (only if zero admins exist)
	const existingAdmins = await db.select().from(adminUsers).limit(1);
	if (existingAdmins.length === 0) {
		const password = env.INITIAL_ADMIN_PASSWORD;
		if (!password) {
			console.warn(
				'  ⚠ No admin user exists and INITIAL_ADMIN_PASSWORD is not set. Skipping admin bootstrap.'
			);
			console.warn('    Set INITIAL_ADMIN_PASSWORD in .env and re-run `npm run db:seed`.');
		} else {
			const passwordHash = await hash(password, 10);
			await db.insert(adminUsers).values({
				email: env.ADMIN_EMAIL,
				passwordHash,
				name: 'De Vleesbobijn'
			});
			console.log(`  ✓ Admin user created: ${env.ADMIN_EMAIL}`);
			console.log('    ⚠ Remove INITIAL_ADMIN_PASSWORD from .env after first deploy.');
		}
	}

	console.log('✅ Seed complete.');
}
