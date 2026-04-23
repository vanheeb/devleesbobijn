import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { env } from '$lib/server/env';

// Single connection for serverless (Vercel); pool size of 1 per instance.
// Neon handles connection pooling server-side.
const requiresSsl = /sslmode=require|neon\.tech|supabase\.co|amazonaws\.com/.test(env.DATABASE_URL);

const client = postgres(env.DATABASE_URL, {
	max: env.NODE_ENV === 'production' ? 1 : 10,
	idle_timeout: 20,
	connect_timeout: 10,
	ssl: requiresSsl ? 'require' : undefined
});

export const db = drizzle(client, { schema });

export type DB = typeof db;
