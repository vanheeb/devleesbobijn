import 'dotenv/config';
import { z } from 'zod';

/**
 * Centralized, validated environment configuration.
 * Fails fast on startup if required vars are missing or malformed.
 * Do NOT import this from client-side code.
 *
 * Reads from SvelteKit's `$env/dynamic/private` so both local `.env`
 * and Vercel-provided env vars work without extra config.
 */

const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

	// Database
	DATABASE_URL: z
		.string()
		.min(1, 'DATABASE_URL is required (Neon Postgres connection string)')
		.url(),

	// Stripe
	STRIPE_SECRET_KEY: z
		.string()
		.min(1, 'STRIPE_SECRET_KEY is required')
		.refine((v) => v.startsWith('sk_'), 'STRIPE_SECRET_KEY must start with sk_'),
	STRIPE_WEBHOOK_SECRET: z
		.string()
		.min(1, 'STRIPE_WEBHOOK_SECRET is required')
		.refine((v) => v.startsWith('whsec_'), 'STRIPE_WEBHOOK_SECRET must start with whsec_'),
	STRIPE_PUBLISHABLE_KEY: z.string().optional(),

	// Email (Resend)
	RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required'),
	RESEND_FROM: z
		.string()
		.min(1, 'RESEND_FROM is required (e.g. "De Vleesbobijn <info@devleesbobijn.be>")'),

	// Admin
	ADMIN_EMAIL: z.string().email('ADMIN_EMAIL must be a valid email'),
	SESSION_SECRET: z
		.string()
		.min(32, 'SESSION_SECRET must be at least 32 characters (use `openssl rand -base64 32`)'),

	// Site
	PUBLIC_SITE_URL: z
		.string()
		.url('PUBLIC_SITE_URL must be a full URL like https://devleesbobijn.be')
		.default('http://localhost:5175'),

	// Business info (defaults in case DB config is missing; admin can override via app_config)
	BUSINESS_NAME: z.string().default('De Vleesbobijn'),
	BUSINESS_ADDRESS: z.string().default('Achterstraat 20, 8540 Deerlijk'),
	BUSINESS_PHONE: z.string().default('+32 479 39 22 83'),
	BUSINESS_VAT_STATUS: z.string().default('Vrijgesteld van BTW'),
	BUSINESS_IBAN: z.string().optional(),

	// Initial admin bootstrap (used by seed script only)
	INITIAL_ADMIN_PASSWORD: z.string().optional()
});

export type Env = z.infer<typeof envSchema>;

function parseEnv(): Env {
	const parsed = envSchema.safeParse(process.env);
	if (!parsed.success) {
		const issues = parsed.error.issues
			.map((i) => `  • ${i.path.join('.')}: ${i.message}`)
			.join('\n');
		throw new Error(
			`\n❌ Invalid environment configuration:\n${issues}\n\nSee .env.example for reference.\n`
		);
	}
	return parsed.data;
}

export const env = parseEnv();
