import { resolve } from 'node:path';

const port = 3002;
const expectedOrigin = process.env.EXPECTED_ORIGIN ?? `http://localhost:${port}`;
// Other sites allowed to use the RP ID (Related Origin Requests), listed in /.well-known/webauthn.
const relatedOrigins = (process.env.RELATED_ORIGINS ?? '').split(',').filter(Boolean);

export const config = {
	port,
	rpName: 'Passkey Auth Demo',
	rpId: process.env.RP_ID ?? 'localhost',
	expectedOrigin,
	relatedOrigins,
	allowedOrigins: [expectedOrigin, ...relatedOrigins],
	dbPath: resolve(import.meta.dir, '../data/demo.sqlite'),
	sessionSecret: process.env.SESSION_SECRET ?? 'dev-only-session-secret-do-not-use-in-production',
	sessionTtlMs: 8 * 60 * 60 * 1000,
	// Derives fake credential IDs for unknown usernames (WebAuthn §14.6.2, username enumeration).
	fakeCredentialSecret:
		process.env.FAKE_CREDENTIAL_SECRET ??
		'dev-only-fake-credential-secret-do-not-use-in-production',
	cookiePath: '/passkeys',
	// Page opened by the recovery link, the token is passed in the fragment.
	recoveryUrl: process.env.RECOVERY_URL ?? `${expectedOrigin}/passkeys/ui/`,
	recoveryTokenTtlMs: 15 * 60 * 1000,
	smtp: {
		host: process.env.SMTP_HOST ?? 'localhost',
		port: Number(process.env.SMTP_PORT ?? 1025)
	},
	mailFrom: `Passkey Auth Demo <no-reply@${process.env.RP_ID}>`
};
