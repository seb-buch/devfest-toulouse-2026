import type {
	AuthenticationResponseJSON,
	PublicKeyCredentialCreationOptionsJSON,
	PublicKeyCredentialDescriptorJSON,
	PublicKeyCredentialRequestOptionsJSON,
	RegistrationResponseJSON,
	VerifiedRegistrationResponse
} from '@simplewebauthn/server';
import {
	generateAuthenticationOptions,
	generateRegistrationOptions,
	verifyAuthenticationResponse,
	verifyRegistrationResponse
} from '@simplewebauthn/server';
import { decodeClientDataJSON, isoBase64URL } from '@simplewebauthn/server/helpers';
import { randomUUIDv7 } from 'bun';
import { createHmac } from 'node:crypto';
import { config } from '../config';
import type {
	ChallengeStore,
	NewUserInfo,
	PasskeyChallenge,
	PasskeyInfo,
	UserInfo,
	UserRepository
} from './types';
import { LastPasskeyError, PasskeyNotFoundError, UserAlreadyExistsError } from './types';

const CHALLENGE_TTL_MS = 5 * 60 * 1000;

type RegistrationInfo = NonNullable<VerifiedRegistrationResponse['registrationInfo']>;

const AUTHENTICATOR_SELECTION = {
	residentKey: 'required',
	userVerification: 'preferred'
} as const;

type NewUserRegistrationInfo = {
	userInfo: NewUserInfo;
	registrationOptions: PublicKeyCredentialCreationOptionsJSON;
};

export class UserManager {
	constructor(
		private userRepository: UserRepository,
		private challengeStore: ChallengeStore
	) {}

	async startUserRegistration(
		user: NewUserInfo,
		passkeyName: string
	): Promise<NewUserRegistrationInfo> {
		await this.challengeStore.purgeExpired(Date.now());

		if (await this.userRepository.isUsernameOrEmailTaken(user.username, user.email)) {
			throw new UserAlreadyExistsError();
		}

		const options = await generateRegistrationOptions({
			rpName: config.rpName,
			rpID: config.rpId,
			userName: user.username,
			userDisplayName: user.displayName,
			attestationType: 'none',
			authenticatorSelection: AUTHENTICATOR_SELECTION
		});

		await this.challengeStore.save({
			type: 'registration',
			challenge: options.challenge,
			webAuthnUserID: options.user.id,
			expiresAt: Date.now() + CHALLENGE_TTL_MS,
			user: { ...user },
			passkeyName
		});

		return { userInfo: user, registrationOptions: options };
	}

	async verifyUserRegistration(response: RegistrationResponseJSON): Promise<UserInfo> {
		const expectedChallenge = await this.consumeChallenge(response, 'registration');
		const registrationInfo = await verifyRegistration(response, expectedChallenge.challenge);

		const newUser: UserInfo = {
			id: randomUUIDv7(),
			webAuthnUserID: expectedChallenge.webAuthnUserID,
			displayName: expectedChallenge.user.displayName,
			email: expectedChallenge.user.email,
			username: expectedChallenge.user.username,
			createdAt: Date.now()
		};
		const passkey = toPasskey(registrationInfo, newUser.id, expectedChallenge.passkeyName);

		await this.userRepository.createUserWithPasskey(newUser, passkey);
		return newUser;
	}

	/**
	 * New passkey for an existing account: same WebAuthn user ID, so password managers file it
	 * under the same account, and excludeCredentials prevents a second passkey on the same
	 * authenticator.
	 */
	async startPasskeyAddition(
		userId: string,
		passkeyName: string
	): Promise<PublicKeyCredentialCreationOptionsJSON> {
		await this.challengeStore.purgeExpired(Date.now());

		const user = await this.userRepository.findUserById(userId);
		if (!user) {
			throw new Error('Unknown user');
		}
		const passkeys = await this.userRepository.findPasskeysByUserId(userId);

		const options = await generateRegistrationOptions({
			rpName: config.rpName,
			rpID: config.rpId,
			userID: isoBase64URL.toBuffer(user.webAuthnUserID),
			userName: user.username,
			userDisplayName: user.displayName,
			attestationType: 'none',
			excludeCredentials: passkeys.map(({ credentialId, transports }) => ({
				id: credentialId,
				transports
			})),
			authenticatorSelection: AUTHENTICATOR_SELECTION
		});

		await this.challengeStore.save({
			type: 'passkey-addition',
			challenge: options.challenge,
			userId,
			passkeyName,
			expiresAt: Date.now() + CHALLENGE_TTL_MS
		});

		return options;
	}

	/** The challenge must have been issued to the same user. */
	async verifyPasskeyAddition(
		userId: string,
		response: RegistrationResponseJSON
	): Promise<PasskeyInfo> {
		const expectedChallenge = await this.consumeChallenge(response, 'passkey-addition');
		if (expectedChallenge.userId !== userId) {
			throw new Error('Challenge issued to another user');
		}

		const registrationInfo = await verifyRegistration(response, expectedChallenge.challenge);
		const passkey = toPasskey(registrationInfo, userId, expectedChallenge.passkeyName);

		await this.userRepository.addPasskey(passkey);
		return passkey;
	}

	/**
	 * Without username: empty allowCredentials, the authenticator discovers the passkey.
	 * With username: allowCredentials lists the user's passkeys.
	 */
	async startAuthentication(username?: string): Promise<PublicKeyCredentialRequestOptionsJSON> {
		await this.challengeStore.purgeExpired(Date.now());

		let expectedUserId: string | null = null;
		let allowCredentials: PublicKeyCredentialDescriptorJSON[] = [];

		if (username) {
			const found = await this.userRepository.findUserWithPasskeysByUsername(username);
			if (found) {
				expectedUserId = found.user.id;
				allowCredentials = found.passkeys.map(({ credentialId, transports }) => ({
					id: credentialId,
					type: 'public-key',
					transports
				}));
			} else {
				// Unknown username: answer as if the account existed (WebAuthn §14.6.2).
				// The random expected user ID can never match, so the ceremony cannot succeed.
				expectedUserId = randomUUIDv7();
				allowCredentials = [fakeCredentialFor(username)];
			}
		}

		const options = await generateAuthenticationOptions({
			rpID: config.rpId,
			allowCredentials,
			userVerification: 'preferred'
		});

		await this.challengeStore.save({
			type: 'authentication',
			challenge: options.challenge,
			expectedUserId,
			expiresAt: Date.now() + CHALLENGE_TTL_MS
		});

		return options;
	}

	async verifyAuthentication(response: AuthenticationResponseJSON): Promise<UserInfo> {
		const expectedChallenge = await this.consumeChallenge(response, 'authentication');

		const found = await this.userRepository.findPasskeyWithUser(response.id);
		if (!found) {
			// 404: the client can tell the passkey provider to forget it (Signal API).
			throw new PasskeyNotFoundError();
		}
		const { user, passkey } = found;

		// WebAuthn §7.2: the passkey must belong to the user identified before the ceremony...
		if (expectedChallenge.expectedUserId !== null && expectedChallenge.expectedUserId !== user.id) {
			throw new Error('Passkey does not belong to this user');
		}

		// ...and the user handle (mandatory when nobody was identified) must match its owner.
		const { userHandle } = response.response;
		if (expectedChallenge.expectedUserId === null && !userHandle) {
			throw new Error('Missing user handle');
		}
		if (userHandle && userHandle !== user.webAuthnUserID) {
			throw new Error('User handle does not match');
		}

		const { verified, authenticationInfo } = await verifyAuthenticationResponse({
			response,
			expectedChallenge: expectedChallenge.challenge,
			expectedOrigin: config.allowedOrigins,
			expectedRPID: config.rpId,
			credential: {
				id: passkey.credentialId,
				publicKey: passkey.publicKey,
				counter: passkey.counter,
				transports: passkey.transports
			},
			requireUserVerification: false
		});

		if (!verified) {
			throw new Error('Passkey authentication failed.');
		}

		await this.userRepository.updatePasskeyUsage(
			passkey.credentialId,
			authenticationInfo.newCounter,
			authenticationInfo.credentialBackedUp,
			Date.now()
		);
		return user;
	}

	/** Returns the remaining passkeys, the client sends them to the passkey provider (Signal API). */
	async deletePasskey(userId: string, credentialId: string): Promise<PasskeyInfo[]> {
		const passkeys = await this.userRepository.findPasskeysByUserId(userId);
		if (!passkeys.some((passkey) => passkey.credentialId === credentialId)) {
			throw new PasskeyNotFoundError();
		}
		if (passkeys.length === 1) {
			throw new LastPasskeyError();
		}

		await this.userRepository.deletePasskey(userId, credentialId);
		return passkeys.filter((passkey) => passkey.credentialId !== credentialId);
	}

	/** A challenge is single-use: it is deleted as soon as a response comes back. */
	private async consumeChallenge<T extends PasskeyChallenge['type']>(
		response: RegistrationResponseJSON | AuthenticationResponseJSON,
		type: T
	): Promise<Extract<PasskeyChallenge, { type: T }>> {
		const { challenge } = decodeClientDataJSON(response.response.clientDataJSON);
		const expectedChallenge = await this.challengeStore.consume(challenge);

		if (!expectedChallenge || expectedChallenge.expiresAt <= Date.now()) {
			throw new Error('Invalid challenge');
		}
		if (expectedChallenge.type !== type) {
			throw new Error('Invalid challenge type');
		}
		return expectedChallenge as Extract<PasskeyChallenge, { type: T }>;
	}
}

async function verifyRegistration(response: RegistrationResponseJSON, expectedChallenge: string) {
	const { verified, registrationInfo } = await verifyRegistrationResponse({
		response,
		expectedChallenge,
		expectedOrigin: config.allowedOrigins,
		expectedRPID: config.rpId,
		requireUserVerification: false
	});

	if (!verified || !registrationInfo) {
		throw new Error('Passkey registration failed.');
	}
	return registrationInfo;
}

function toPasskey(
	{ credential, credentialDeviceType, credentialBackedUp }: RegistrationInfo,
	userId: string,
	name: string
): PasskeyInfo {
	return {
		credentialId: credential.id,
		userId,
		name,
		publicKey: credential.publicKey,
		counter: credential.counter,
		transports: credential.transports,
		deviceType: credentialDeviceType,
		backedUp: credentialBackedUp,
		createdAt: Date.now(),
		lastUsedAt: null
	};
}

/** Same username, same fake credential: unknown accounts look like real ones. */
function fakeCredentialFor(username: string): PublicKeyCredentialDescriptorJSON {
	const id = createHmac('sha256', config.fakeCredentialSecret)
		.update(username.toLowerCase())
		.digest('base64url');
	return { id, type: 'public-key', transports: ['hybrid', 'internal'] };
}
