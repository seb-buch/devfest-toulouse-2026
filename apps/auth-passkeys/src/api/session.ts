import type { Context } from 'hono';
import { deleteCookie, getSignedCookie, setSignedCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { config } from '../config';

const COOKIE_NAME = 'session';

type Session = {
	userId: string;
	expiresAt: number;
};

export type SessionEnv = {
	Variables: { userId: string };
};

export async function startSession(c: Context, userId: string): Promise<void> {
	const session: Session = { userId, expiresAt: Date.now() + config.sessionTtlMs };
	await setSignedCookie(c, COOKIE_NAME, JSON.stringify(session), config.sessionSecret, {
		path: config.cookiePath,
		httpOnly: true,
		secure: true,
		sameSite: 'Lax',
		maxAge: config.sessionTtlMs / 1000
	});
}

export function endSession(c: Context): void {
	deleteCookie(c, COOKIE_NAME, { path: config.cookiePath, secure: true });
}

async function readSession(c: Context): Promise<Session | null> {
	const value = await getSignedCookie(c, config.sessionSecret, COOKIE_NAME);
	if (!value) {
		return null;
	}
	const session = JSON.parse(value) as Session;
	return session.expiresAt > Date.now() ? session : null;
}

export const requireSession = createMiddleware<SessionEnv>(async (c, next) => {
	const session = await readSession(c);
	if (!session) {
		throw new HTTPException(401, { message: 'Not authenticated' });
	}
	c.set('userId', session.userId);
	await next();
});
