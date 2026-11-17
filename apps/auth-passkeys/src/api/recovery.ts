import type {
	PublicKeyCredentialCreationOptionsJSON,
	RegistrationResponseJSON
} from '@simplewebauthn/server';
import { createHash, randomBytes } from 'node:crypto';
import { config } from '../config';
import { sendRecoveryEmail } from './mail';
import type { RecoveryTokenStore, UserInfo, UserRepository } from './types';
import type { UserManager } from './user';

/**
 * Recovery when all passkeys are lost: a single-use link sent to the account email.
 * The token only allows creating a new passkey, it does not sign in by itself.
 */
export class RecoveryManager {
	constructor(
		private userRepository: UserRepository,
		private tokenStore: RecoveryTokenStore,
		private userManager: UserManager
	) {}

	/** Same behavior whether the email is known or not: the answer reveals nothing. */
	async requestRecovery(email: string): Promise<void> {
		await this.tokenStore.purgeExpired(Date.now());

		const user = await this.userRepository.findUserByEmail(email);
		if (!user) {
			return;
		}

		const token = randomBytes(32).toString('base64url');
		await this.tokenStore.save(hashToken(token), user.id, Date.now() + config.recoveryTokenTtlMs);

		// Not awaited: the response time must not depend on the email being sent.
		sendRecoveryEmail(user, `${config.recoveryUrl}#token=${token}`).catch(console.error);
	}

	async startPasskeyRecovery(
		token: string,
		passkeyName: string
	): Promise<PublicKeyCredentialCreationOptionsJSON> {
		const userId = await this.tokenStore.find(hashToken(token));
		if (!userId) {
			throw new Error('Invalid or expired recovery link');
		}
		return this.userManager.startPasskeyAddition(userId, passkeyName);
	}

	async verifyPasskeyRecovery(
		token: string,
		response: RegistrationResponseJSON
	): Promise<UserInfo> {
		const userId = await this.tokenStore.consume(hashToken(token));
		if (!userId) {
			throw new Error('Invalid or expired recovery link');
		}
		await this.userManager.verifyPasskeyAddition(userId, response);

		const user = await this.userRepository.findUserById(userId);
		if (!user) {
			throw new Error('Unknown user');
		}
		return user;
	}
}

function hashToken(token: string): string {
	return createHash('sha256').update(token).digest('base64url');
}
