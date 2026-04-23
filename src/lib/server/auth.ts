import { db } from './db';
import { sessions, adminUsers } from './db/schema';
import { eq, and, gt, lt } from 'drizzle-orm';
import { randomBytes } from 'crypto';

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function createSession(adminUserId: number): Promise<string> {
	const id = randomBytes(32).toString('hex');
	const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

	await db.insert(sessions).values({ id, adminUserId, expiresAt });
	return id;
}

export async function validateSession(sessionId: string) {
	if (!sessionId) return null;

	const [result] = await db
		.select({
			sessionId: sessions.id,
			adminUserId: sessions.adminUserId,
			expiresAt: sessions.expiresAt,
			adminName: adminUsers.name,
			adminEmail: adminUsers.email
		})
		.from(sessions)
		.innerJoin(adminUsers, eq(sessions.adminUserId, adminUsers.id))
		.where(and(eq(sessions.id, sessionId), gt(sessions.expiresAt, new Date())))
		.limit(1);

	return result || null;
}

export async function deleteSession(sessionId: string): Promise<void> {
	await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export async function deleteAllSessionsForUser(adminUserId: number): Promise<void> {
	await db.delete(sessions).where(eq(sessions.adminUserId, adminUserId));
}

/** Cleanup expired sessions — call periodically or lazily. */
export async function pruneExpiredSessions(): Promise<void> {
	await db.delete(sessions).where(lt(sessions.expiresAt, new Date()));
}

export const SESSION_COOKIE_NAME = 'session';

export function sessionCookieOptions(isProduction: boolean) {
	return {
		path: '/',
		httpOnly: true,
		sameSite: 'lax' as const,
		secure: isProduction,
		maxAge: Math.floor(SESSION_TTL_MS / 1000)
	};
}
