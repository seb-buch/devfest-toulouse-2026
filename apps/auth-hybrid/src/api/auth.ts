import { betterAuth, type BetterAuthOptions } from 'better-auth';
import { getMigrations } from 'better-auth/db/migration';
import { twoFactor, username } from 'better-auth/plugins';
import { passkey } from '@better-auth/passkey';
import { database } from './storage';
import { config } from '../config';

const options: BetterAuthOptions = {
	database: database,
	baseURL: config.expectedOrigin,
	basePath: config.basePath,
	appName: config.appName,
	emailAndPassword: {
		enabled: true,
		autoSignIn: false
	},
	plugins: [
		username(),
		twoFactor({ backupCodeOptions: { amount: 0 } }),
		// Profil passkey grand public : défaut du plugin residentKey « preferred »
		passkey({ authenticatorSelection: { residentKey: 'required', userVerification: 'preferred' } })
	],
	disabledPaths: ['/two-factor/generate-backup-codes', '/two-factor/verify-backup-code'],
	advanced: {
		defaultCookieAttributes: {
			path: config.cookiePath
		},
		database: {
			joins: true
		}
	}
};

const { runMigrations } = await getMigrations(options);
await runMigrations();

export const auth = betterAuth(options);
