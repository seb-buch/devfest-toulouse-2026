import type { CredentialDeviceType, WebAuthnCredential } from '@simplewebauthn/server';

export type NewUserInfo = {
	username: string;
	displayName: string;
	email: string;
};

export type UserInfo = NewUserInfo & {
	id: string;
	webAuthnUserID: string;
	createdAt: number;
};

export type PasskeyInfo = {
	credentialId: WebAuthnCredential['id'];
	userId: string;
	name: string;
	publicKey: WebAuthnCredential['publicKey'];
	counter: WebAuthnCredential['counter'];
	transports?: WebAuthnCredential['transports'];
	deviceType: CredentialDeviceType;
	backedUp: boolean;
	createdAt: number;
	lastUsedAt: number | null;
};

type ChallengeBase = {
	challenge: string;
	expiresAt: number;
};

export type RegistrationChallenge = ChallengeBase & {
	type: 'registration';
	webAuthnUserID: string;
	user: NewUserInfo;
	passkeyName: string;
};

export type AuthenticationChallenge = ChallengeBase & {
	type: 'authentication';
	/** User identified before the ceremony (username given), null for usernameless sign-in. */
	expectedUserId: string | null;
};

/** A new passkey for an existing account (signed-in user or account recovery). */
export type PasskeyAdditionChallenge = ChallengeBase & {
	type: 'passkey-addition';
	userId: string;
	passkeyName: string;
};

export type PasskeyChallenge =
	RegistrationChallenge | AuthenticationChallenge | PasskeyAdditionChallenge;

export interface UserRepository {
	isUsernameOrEmailTaken(username: string, email: string): Promise<boolean>;
	findUserById(id: string): Promise<UserInfo | null>;
	findUserByEmail(email: string): Promise<UserInfo | null>;
	/** Persists the user and its first passkey atomically. */
	createUserWithPasskey(user: UserInfo, passkey: PasskeyInfo): Promise<void>;
	addPasskey(passkey: PasskeyInfo): Promise<void>;
	deletePasskey(userId: string, credentialId: string): Promise<void>;
	findPasskeysByUserId(userId: string): Promise<PasskeyInfo[]>;
	findPasskeyWithUser(
		credentialId: string
	): Promise<{ user: UserInfo; passkey: PasskeyInfo } | null>;
	findUserWithPasskeysByUsername(
		username: string
	): Promise<{ user: UserInfo; passkeys: PasskeyInfo[] } | null>;
	updatePasskeyUsage(
		credentialId: string,
		counter: number,
		backedUp: boolean,
		lastUsedAt: number
	): Promise<void>;
}

export interface ChallengeStore {
	save(challenge: PasskeyChallenge): Promise<void>;
	/** Returns and deletes the challenge so it can only be used once. */
	consume(challenge: string): Promise<PasskeyChallenge | null>;
	purgeExpired(now: number): Promise<void>;
}

/** Only a hash of the token is stored: a database leak does not give access to any account. */
export interface RecoveryTokenStore {
	/** Replaces any previous token of the user: only the last emailed link works. */
	save(tokenHash: string, userId: string, expiresAt: number): Promise<void>;
	/** Returns the user ID of a valid token, without using it. */
	find(tokenHash: string): Promise<string | null>;
	/** Returns the user ID of a valid token and deletes it so it can only be used once. */
	consume(tokenHash: string): Promise<string | null>;
	purgeExpired(now: number): Promise<void>;
}

export class PasskeyNotFoundError extends Error {
	constructor() {
		super('Unknown passkey');
		this.name = 'PasskeyNotFoundError';
	}
}

/** An account must keep at least one passkey to sign in (FIDO UX guidelines). */
export class LastPasskeyError extends Error {
	constructor() {
		super('The last passkey of an account cannot be deleted');
		this.name = 'LastPasskeyError';
	}
}

export class UserAlreadyExistsError extends Error {
	constructor() {
		super('Username or email already in use');
		this.name = 'UserAlreadyExistsError';
	}
}
