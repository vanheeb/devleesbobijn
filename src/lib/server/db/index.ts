import { neonConfig, Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from './schema';
import { env } from '$lib/server/env';
import ws from 'ws';

// Use WebSocket for transactions (required for FOR UPDATE locks in serverless)
neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: env.DATABASE_URL });

export const db = drizzle(pool, { schema });

export type DB = typeof db;
