/**
 * Apply pending Drizzle migrations to the Postgres database.
 * Usage: npm run db:migrate
 */
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const url = process.env.DATABASE_URL;
if (!url) {
	console.error('❌ DATABASE_URL is required in .env');
	process.exit(1);
}

const client = postgres(url, { max: 1, ssl: url.includes('sslmode=require') ? 'require' : undefined });
const db = drizzle(client);

console.log('Running migrations...');
await migrate(db, { migrationsFolder: './drizzle/migrations' });
console.log('✅ Migrations applied.');
await client.end();
