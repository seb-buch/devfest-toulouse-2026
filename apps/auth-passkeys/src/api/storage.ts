import { Database, SQLiteError } from 'bun:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { config } from '../config';
import type {
	ChallengeStore,
	PasskeyChallenge,
	PasskeyInfo,
	RecoveryTokenStore,
	UserInfo,
	UserRepository
} from './types';
import { UserAlreadyExistsError } from './types';

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
	id TEXT PRIMARY KEY,
	webauthn_user_id TEXT NOT NULL UNIQUE,
	username TEXT NOT NULL UNIQUE COLLATE NOCASE,
	display_name TEXT NOT NULL,
	email TEXT NOT NULL UNIQUE COLLATE NOCASE,
	created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS passkeys (
	credential_id TEXT PRIMARY KEY,
	user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	name TEXT NOT NULL,
	public_key BLOB NOT NULL,
	counter INTEGER NOT NULL,
	transports TEXT,
	device_type TEXT NOT NULL,
	backed_up INTEGER NOT NULL,
	created_at INTEGER NOT NULL,
	last_used_at INTEGER
);
CREATE INDEX IF NOT EXISTS passkeys_user_id ON passkeys(user_id);

CREATE TABLE IF NOT EXISTS challenges (
	challenge TEXT PRIMARY KEY,
	type TEXT NOT NULL,
	payload TEXT NOT NULL,
	expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS challenges_expires_at ON challenges(expires_at);

CREATE TABLE IF NOT EXISTS recovery_tokens (
	token_hash TEXT PRIMARY KEY,
	user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS recovery_tokens_user_id ON recovery_tokens(user_id);
`;

export function openDatabase(path: string = config.dbPath): Database {
	if (path !== ':memory:') {
		mkdirSync(dirname(path), { recursive: true });
	}
	const db = new Database(path, { create: true, strict: true });
	db.run('PRAGMA journal_mode = WAL');
	db.run('PRAGMA foreign_keys = ON');
	db.run(SCHEMA);
	return db;
}

type UserRow = {
	id: string;
	webauthn_user_id: string;
	username: string;
	display_name: string;
	email: string;
	created_at: number;
};

type PasskeyRow = {
	credential_id: string;
	user_id: string;
	name: string;
	public_key: Uint8Array;
	counter: number;
	transports: string | null;
	device_type: string;
	backed_up: number;
	created_at: number;
	last_used_at: number | null;
};

type ChallengeRow = {
	challenge: string;
	type: string;
	payload: string;
	expires_at: number;
};

function toUser(row: UserRow): UserInfo {
	return {
		id: row.id,
		webAuthnUserID: row.webauthn_user_id,
		username: row.username,
		displayName: row.display_name,
		email: row.email,
		createdAt: row.created_at
	};
}

function toPasskey(row: PasskeyRow): PasskeyInfo {
	return {
		credentialId: row.credential_id,
		userId: row.user_id,
		name: row.name,
		publicKey: new Uint8Array(row.public_key),
		counter: row.counter,
		transports: row.transports ? JSON.parse(row.transports) : undefined,
		deviceType: row.device_type as PasskeyInfo['deviceType'],
		backedUp: row.backed_up === 1,
		createdAt: row.created_at,
		lastUsedAt: row.last_used_at
	};
}

export class SqliteUserRepository implements UserRepository {
	constructor(private db: Database) {}

	async isUsernameOrEmailTaken(username: string, email: string): Promise<boolean> {
		const row = this.db
			.query('SELECT 1 FROM users WHERE username = $username OR email = $email LIMIT 1')
			.get({ username, email });
		return row !== null;
	}

	async findUserById(id: string): Promise<UserInfo | null> {
		const row = this.db
			.query<UserRow, { id: string }>('SELECT * FROM users WHERE id = $id')
			.get({ id });
		return row ? toUser(row) : null;
	}

	async findUserByEmail(email: string): Promise<UserInfo | null> {
		const row = this.db
			.query<UserRow, { email: string }>('SELECT * FROM users WHERE email = $email')
			.get({ email });
		return row ? toUser(row) : null;
	}

	async createUserWithPasskey(user: UserInfo, passkey: PasskeyInfo): Promise<void> {
		const insertUser = this.db.query(
			`INSERT INTO users (id, webauthn_user_id, username, display_name, email, created_at)
			 VALUES ($id, $webAuthnUserID, $username, $displayName, $email, $createdAt)`
		);
		const insertAll = this.db.transaction(() => {
			insertUser.run({
				id: user.id,
				webAuthnUserID: user.webAuthnUserID,
				username: user.username,
				displayName: user.displayName,
				email: user.email,
				createdAt: user.createdAt
			});
			this.insertPasskey(passkey);
		});

		try {
			insertAll();
		} catch (error) {
			if (
				error instanceof SQLiteError &&
				error.code === 'SQLITE_CONSTRAINT_UNIQUE' &&
				/users\.(username|email)/.test(error.message)
			) {
				throw new UserAlreadyExistsError();
			}
			throw error;
		}
	}

	async addPasskey(passkey: PasskeyInfo): Promise<void> {
		this.insertPasskey(passkey);
	}

	async deletePasskey(userId: string, credentialId: string): Promise<void> {
		this.db
			.query('DELETE FROM passkeys WHERE credential_id = $credentialId AND user_id = $userId')
			.run({ credentialId, userId });
	}

	private insertPasskey(passkey: PasskeyInfo): void {
		this.db
			.query(
				`INSERT INTO passkeys (credential_id, user_id, name, public_key, counter, transports,
				                       device_type, backed_up, created_at, last_used_at)
				 VALUES ($credentialId, $userId, $name, $publicKey, $counter, $transports,
				         $deviceType, $backedUp, $createdAt, $lastUsedAt)`
			)
			.run({
				credentialId: passkey.credentialId,
				userId: passkey.userId,
				name: passkey.name,
				publicKey: passkey.publicKey,
				counter: passkey.counter,
				transports: passkey.transports ? JSON.stringify(passkey.transports) : null,
				deviceType: passkey.deviceType,
				backedUp: passkey.backedUp ? 1 : 0,
				createdAt: passkey.createdAt,
				lastUsedAt: passkey.lastUsedAt
			});
	}

	async findPasskeysByUserId(userId: string): Promise<PasskeyInfo[]> {
		return this.db
			.query<PasskeyRow, { userId: string }>(
				'SELECT * FROM passkeys WHERE user_id = $userId ORDER BY created_at'
			)
			.all({ userId })
			.map(toPasskey);
	}

	async findPasskeyWithUser(
		credentialId: string
	): Promise<{ user: UserInfo; passkey: PasskeyInfo } | null> {
		const passkeyRow = this.db
			.query<PasskeyRow, { credentialId: string }>(
				'SELECT * FROM passkeys WHERE credential_id = $credentialId'
			)
			.get({ credentialId });
		if (!passkeyRow) {
			return null;
		}
		const userRow = this.db
			.query<UserRow, { id: string }>('SELECT * FROM users WHERE id = $id')
			.get({ id: passkeyRow.user_id });
		if (!userRow) {
			return null;
		}
		return { user: toUser(userRow), passkey: toPasskey(passkeyRow) };
	}

	async findUserWithPasskeysByUsername(
		username: string
	): Promise<{ user: UserInfo; passkeys: PasskeyInfo[] } | null> {
		const userRow = this.db
			.query<UserRow, { username: string }>('SELECT * FROM users WHERE username = $username')
			.get({ username });
		if (!userRow) {
			return null;
		}
		const user = toUser(userRow);
		return { user, passkeys: await this.findPasskeysByUserId(user.id) };
	}

	async updatePasskeyUsage(
		credentialId: string,
		counter: number,
		backedUp: boolean,
		lastUsedAt: number
	): Promise<void> {
		this.db
			.query(
				`UPDATE passkeys SET counter = $counter, backed_up = $backedUp, last_used_at = $lastUsedAt
				 WHERE credential_id = $credentialId`
			)
			.run({ credentialId, counter, backedUp: backedUp ? 1 : 0, lastUsedAt });
	}
}

export class SqliteChallengeStore implements ChallengeStore {
	constructor(private db: Database) {}

	async save({ challenge, type, expiresAt, ...payload }: PasskeyChallenge): Promise<void> {
		this.db
			.query(
				`INSERT INTO challenges (challenge, type, payload, expires_at)
				 VALUES ($challenge, $type, $payload, $expiresAt)`
			)
			.run({ challenge, type, payload: JSON.stringify(payload), expiresAt });
	}

	async consume(challenge: string): Promise<PasskeyChallenge | null> {
		const row = this.db
			.query<ChallengeRow, { challenge: string }>(
				'DELETE FROM challenges WHERE challenge = $challenge RETURNING challenge, type, payload, expires_at'
			)
			.get({ challenge });
		if (!row) {
			return null;
		}
		return {
			...JSON.parse(row.payload),
			challenge: row.challenge,
			type: row.type,
			expiresAt: row.expires_at
		} as PasskeyChallenge;
	}

	async purgeExpired(now: number): Promise<void> {
		this.db.query('DELETE FROM challenges WHERE expires_at <= $now').run({ now });
	}
}

export class SqliteRecoveryTokenStore implements RecoveryTokenStore {
	constructor(private db: Database) {}

	async save(tokenHash: string, userId: string, expiresAt: number): Promise<void> {
		this.db.transaction(() => {
			this.db.query('DELETE FROM recovery_tokens WHERE user_id = $userId').run({ userId });
			this.db
				.query(
					`INSERT INTO recovery_tokens (token_hash, user_id, expires_at)
					 VALUES ($tokenHash, $userId, $expiresAt)`
				)
				.run({ tokenHash, userId, expiresAt });
		})();
	}

	async find(tokenHash: string): Promise<string | null> {
		const row = this.db
			.query<{ user_id: string }, { tokenHash: string; now: number }>(
				'SELECT user_id FROM recovery_tokens WHERE token_hash = $tokenHash AND expires_at > $now'
			)
			.get({ tokenHash, now: Date.now() });
		return row?.user_id ?? null;
	}

	async consume(tokenHash: string): Promise<string | null> {
		const row = this.db
			.query<{ user_id: string; expires_at: number }, { tokenHash: string }>(
				'DELETE FROM recovery_tokens WHERE token_hash = $tokenHash RETURNING user_id, expires_at'
			)
			.get({ tokenHash });
		return row && row.expires_at > Date.now() ? row.user_id : null;
	}

	async purgeExpired(now: number): Promise<void> {
		this.db.query('DELETE FROM recovery_tokens WHERE expires_at <= $now').run({ now });
	}
}
