import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { adminUsers } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { compare } from 'bcrypt';
import { createSession, SESSION_COOKIE_NAME, sessionCookieOptions } from '$lib/server/auth';
import { env } from '$lib/server/env';
import type { Actions } from './$types';

export async function load({ locals }) {
	if (locals.admin) {
		throw redirect(303, '/admin');
	}
}

export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = (formData.get('email') as string)?.trim().toLowerCase();
		const password = formData.get('password') as string;

		if (!email || !password) {
			return fail(400, { error: 'Vul alle velden in.' });
		}

		const [user] = await db
			.select()
			.from(adminUsers)
			.where(eq(adminUsers.email, email))
			.limit(1);

		if (!user || !(await compare(password, user.passwordHash))) {
			// Generic error to avoid user enumeration
			return fail(401, { error: 'Ongeldige e-mail of wachtwoord.' });
		}

		const sessionId = await createSession(user.id);

		cookies.set(
			SESSION_COOKIE_NAME,
			sessionId,
			sessionCookieOptions(env.NODE_ENV === 'production')
		);

		throw redirect(303, '/admin');
	}
} satisfies Actions;
