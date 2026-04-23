import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { validateSession, SESSION_COOKIE_NAME } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(SESSION_COOKIE_NAME);

	if (sessionId) {
		const session = await validateSession(sessionId);
		if (session) {
			event.locals.admin = {
				id: session.adminUserId,
				name: session.adminName,
				email: session.adminEmail
			};
		}
	}

	// Protect admin routes (except login)
	if (event.url.pathname.startsWith('/admin') && !event.url.pathname.startsWith('/admin/login')) {
		if (!event.locals.admin) {
			throw redirect(303, '/admin/login');
		}
	}

	return resolve(event);
};
