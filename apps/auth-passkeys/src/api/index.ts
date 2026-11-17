import type { AuthenticationResponseJSON, RegistrationResponseJSON } from '@simplewebauthn/server';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { RecoveryManager } from './recovery';
import { endSession, requireSession, type SessionEnv, startSession } from './session';
import {
	openDatabase,
	SqliteChallengeStore,
	SqliteRecoveryTokenStore,
	SqliteUserRepository
} from './storage';
import {
	LastPasskeyError,
	PasskeyNotFoundError,
	type PasskeyInfo,
	UserAlreadyExistsError,
	type UserInfo
} from './types';
import { UserManager } from './user';

const DEFAULT_PASSKEY_NAME = 'Passkey';

const db = openDatabase();
const userRepository = new SqliteUserRepository(db);
const userManager = new UserManager(userRepository, new SqliteChallengeStore(db));
const recoveryManager = new RecoveryManager(
	userRepository,
	new SqliteRecoveryTokenStore(db),
	userManager
);

function requireString(body: Record<string, unknown>, field: string): string {
	const value = body[field];
	if (typeof value !== 'string' || value.trim() === '') {
		throw new HTTPException(400, { message: `Missing field: ${field}` });
	}
	return value.trim();
}

function optionalString(body: Record<string, unknown>, field: string): string | undefined {
	const value = body[field];
	return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined;
}

/** webAuthnUserID is not a secret: the client needs it for the Signal API. */
function publicUser({ id, webAuthnUserID, username, displayName, email }: UserInfo) {
	return { id, webAuthnUserID, username, displayName, email };
}

/** No public key nor counter: the client only needs to display and identify the passkeys. */
function publicPasskey(passkey: PasskeyInfo) {
	const { credentialId, name, deviceType, backedUp, createdAt, lastUsedAt } = passkey;
	return { credentialId, name, deviceType, backedUp, createdAt, lastUsedAt };
}

const api = new Hono<SessionEnv>();

api.get('/health', (c) => c.json({ status: 'ok' }));

api.post('/register/options', async (c) => {
	const body = await c.req.json();
	const user = {
		username: requireString(body, 'username'),
		displayName: requireString(body, 'displayName'),
		email: requireString(body, 'email')
	};
	const passkeyName = optionalString(body, 'passkeyName') ?? DEFAULT_PASSKEY_NAME;

	const { registrationOptions } = await userManager.startUserRegistration(user, passkeyName);
	return c.json(registrationOptions);
});

api.post('/register/verify', async (c) => {
	const response = await c.req.json<RegistrationResponseJSON>();
	const user = await userManager.verifyUserRegistration(response);
	await startSession(c, user.id);
	return c.json(publicUser(user));
});

api.post('/authenticate/options', async (c) => {
	// The body is optional: usernameless sign-in (conditional UI) sends nothing.
	const body = await c.req.json().catch(() => ({}));
	return c.json(await userManager.startAuthentication(optionalString(body, 'username')));
});

api.post('/authenticate/verify', async (c) => {
	const response = await c.req.json<AuthenticationResponseJSON>();
	const user = await userManager.verifyAuthentication(response);
	await startSession(c, user.id);
	return c.json(publicUser(user));
});

api.get('/me', requireSession, async (c) => {
	const user = await userRepository.findUserById(c.get('userId'));
	if (!user) {
		endSession(c);
		throw new HTTPException(401, { message: 'Not authenticated' });
	}
	return c.json(publicUser(user));
});

api.get('/me/passkeys', requireSession, async (c) => {
	const passkeys = await userRepository.findPasskeysByUserId(c.get('userId'));
	return c.json(passkeys.map(publicPasskey));
});

api.post('/me/passkeys/register/options', requireSession, async (c) => {
	const body = await c.req.json().catch(() => ({}));
	const passkeyName = optionalString(body, 'passkeyName') ?? DEFAULT_PASSKEY_NAME;
	return c.json(await userManager.startPasskeyAddition(c.get('userId'), passkeyName));
});

api.post('/me/passkeys/register/verify', requireSession, async (c) => {
	const response = await c.req.json<RegistrationResponseJSON>();
	const passkey = await userManager.verifyPasskeyAddition(c.get('userId'), response);
	return c.json(publicPasskey(passkey));
});

api.delete('/me/passkeys/:credentialId', requireSession, async (c) => {
	const remaining = await userManager.deletePasskey(c.get('userId'), c.req.param('credentialId'));
	return c.json(remaining.map(publicPasskey));
});

api.post('/recovery/request', async (c) => {
	const body = await c.req.json();
	await recoveryManager.requestRecovery(requireString(body, 'email'));
	return c.body(null, 202);
});

api.post('/recovery/register/options', async (c) => {
	const body = await c.req.json();
	const passkeyName = optionalString(body, 'passkeyName') ?? DEFAULT_PASSKEY_NAME;
	return c.json(
		await recoveryManager.startPasskeyRecovery(requireString(body, 'token'), passkeyName)
	);
});

api.post('/recovery/register/verify', async (c) => {
	const body = await c.req.json<{ token: unknown; response: RegistrationResponseJSON }>();
	const user = await recoveryManager.verifyPasskeyRecovery(
		requireString(body, 'token'),
		body.response
	);
	await startSession(c, user.id);
	return c.json(publicUser(user));
});

api.post('/logout', (c) => {
	endSession(c);
	return c.body(null, 204);
});

api.onError((error, c) => {
	if (error instanceof HTTPException) {
		return c.json({ message: error.message }, error.status);
	}
	if (error instanceof PasskeyNotFoundError) {
		return c.json({ message: error.message }, 404);
	}
	if (error instanceof UserAlreadyExistsError || error instanceof LastPasskeyError) {
		return c.json({ message: error.message }, 409);
	}
	console.error(error);
	return c.json({ message: error.message }, 400);
});

export default api;
