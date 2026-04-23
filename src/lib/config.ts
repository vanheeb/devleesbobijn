/**
 * Central runtime configuration for business info, pricing defaults, etc.
 *
 * This module exposes PUBLIC (client-safe) config only.
 * Values are sourced from env vars with sensible defaults.
 *
 * At runtime, admin can override most of these via the `app_config` table
 * (see src/lib/server/db/schema.ts). For now, env is the single source.
 */

// Client-safe defaults (these values are safe to expose in the browser).
// For server-only env, import from $lib/server/env instead.
export const businessConfig = {
	name: 'De Vleesbobijn',
	tagline: 'Het unieke feestconcept voor thuis',
	address: {
		street: 'Achterstraat 20',
		postalCode: '8540',
		city: 'Deerlijk',
		country: 'België',
		full: 'Achterstraat 20, 8540 Deerlijk'
	},
	phone: '+32 479 39 22 83',
	phoneFormatted: '+32 479 39 22 83',
	email: 'devleesbobijn@gmail.com',
	vatStatus: 'Vrijgesteld van BTW',
	social: {
		facebook: 'https://www.facebook.com/devleesbobijn',
		instagram: 'https://www.instagram.com/devleesbobijn'
	}
} as const;

// Pricing defaults (in cents)
export const pricingConfig = {
	depositCents: 25000, // €250 waarborg
	cleaningFeeCents: 10000, // €100 reinigingskosten indien niet gereinigd teruggebracht
	saucePerLiterCents: 1000 // €10/L sauzen (default, kan per extra verschillen)
} as const;

// Booking rules
export const bookingConfig = {
	reservationTtlMinutes: 30, // Pending bookings expire after 30 min without payment
	maxAdvanceMonths: 18, // Max 18 months in advance
	minAdvanceDays: 2 // Minimum 2 days notice
} as const;

// Helpers live in $lib/utils/pricing for re-use; re-export for convenience.
export { formatPrice, formatPriceShort } from './utils/pricing';
