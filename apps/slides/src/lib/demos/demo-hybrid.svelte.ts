import { apiAvailable } from '#lib/api.ts';

type UserInfo = {
	username: string;
	email: string;
	mfaEnabled: boolean;
};

type LoginInfo = {
	login: string;
	password: string;
};

type NewUser = {
	username: string;
	email: string;
	displayName: string;
	password: string;
};

/*  Échanges d'une cérémonie WebAuthn, transmis au parent pour les diagrammes  */

export type Ceremony = {
	type: 'registration' | 'authentication';
	options?: unknown;
	credential?: unknown;
	verification?: unknown;
	error?: unknown;
};

export type DemoCallbacks = {
	onCeremony?(ceremony: Ceremony): void;
};

/*  États communs aux deux modes  */

export type InitialState = {
	name: 'initial';
	initialize(callbacks?: DemoCallbacks): Promise<UserLoginState | UnavailableState>;
};
export type UnavailableState = {
	name: 'unavailable';
	reason: string;
};

export type UserLoginState = {
	name: 'login';
	errorMessage?: string;

	login(loginInfo: LoginInfo): Promise<AuthenticatedState | MfaVerificationState | UserLoginState>;
	toRegistration(): Promise<UserRegistrationState>;
};

export type UserRegistrationState = {
	name: 'registration';
	errorMessage?: string;

	registerUser(user: NewUser): Promise<UserLoginState | UserRegistrationState>;
	toLogin(): Promise<UserLoginState>;
};

export type AuthenticatedState = {
	name: 'authenticated';
	user: UserInfo;
	errorMessage?: string;

	logout(): Promise<UserLoginState>;
	setupMfa(password: string): Promise<MfaSetupState | AuthenticatedState>;
};

export type MfaSetupState = {
	name: 'mfa-setup';
	totpURI: string;
	errorMessage?: string;

	cancel(): Promise<AuthenticatedState>;
	verifyTotp(totp: string): Promise<AuthenticatedState | MfaSetupState>;
};

export type MfaVerificationState = {
	name: 'mfa-verification';
	errorMessage?: string;

	verifyTotp(totp: string): Promise<AuthenticatedState | MfaVerificationState>;
};

export type AuthenticationState =
	| InitialState
	| UnavailableState
	| UserLoginState
	| UserRegistrationState
	| AuthenticatedState
	| MfaSetupState
	| MfaVerificationState;

/*  Mode « mfa+passkey » : les états login et authenticated proposent en plus les cérémonies WebAuthn  */

export type PasskeyLoginState = UserLoginState & {
	loginWithPasskey(
		mediation: 'conditional' | 'modal',
		signal?: AbortSignal
	): Promise<AuthenticatedState | UserLoginState>;
};

export type PasskeyAuthenticatedState = AuthenticatedState & {
	infoMessage?: string;

	addPasskey(name: string): Promise<AuthenticatedState>;
};

export type PasskeyAuthenticationState =
	| Exclude<AuthenticationState, UserLoginState | AuthenticatedState>
	| PasskeyLoginState
	| PasskeyAuthenticatedState;

type DemoMode = 'mfa' | 'mfa+passkey';

/*  Communication avec l'API Better-Auth de auth-hybrid (même origine, via Caddy)  */

const API_URL = '/hybrid/api';

type Session = {
	user: { username: string; email: string; twoFactorEnabled: boolean };
};

class ApiError extends Error {
	constructor(
		readonly status: number,
		readonly body: unknown
	) {
		super(`Erreur ${status}`);
	}
}

async function request<T>(path: string, body?: unknown): Promise<T> {
	const response = await fetch(`${API_URL}/${path}`, {
		method: body ? 'POST' : 'GET',
		headers: body ? { 'Content-Type': 'application/json' } : {},
		body: body ? JSON.stringify(body) : undefined,
		cache: 'no-store'
	});
	const data = await response.json();
	if (!response.ok) throw new ApiError(response.status, data);
	return data;
}

async function fetchUser(): Promise<UserInfo> {
	const session = await request<Session | null>('get-session');
	if (!session) throw new Error('Aucune session');
	const { username, email, twoFactorEnabled } = session.user;
	return { username, email, mfaEnabled: twoFactorEnabled };
}

/*  Erreur lisible dans un diagramme : corps de la réponse API ou exception du navigateur  */
function describeError(error: unknown): unknown {
	if (error instanceof ApiError) return error.body;
	if (error instanceof Error) return { name: error.name, message: error.message };
	return error;
}

/*  Construction des états : chaque état porte ses propres transitions  */

function createHybridDemo(mode: 'mfa'): () => AuthenticationState;
function createHybridDemo(mode: 'mfa+passkey'): () => PasskeyAuthenticationState;
function createHybridDemo(mode: DemoMode): () => AuthenticationState {
	let callbacks: DemoCallbacks = {};

	let authenticationState: AuthenticationState = $state.raw({
		name: 'initial',
		initialize
	});

	function setState<State extends AuthenticationState>(state: State): State {
		authenticationState = state;
		return state;
	}

	async function initialize(
		demoCallbacks: DemoCallbacks = {}
	): Promise<UserLoginState | UnavailableState> {
		callbacks = demoCallbacks;
		if (!apiAvailable) return setState(unavailableState('API désactivée (mode offline)'));
		try {
			await request('ok');
			return setState(loginState());
		} catch {
			return setState(unavailableState('API injoignable'));
		}
	}

	function unavailableState(reason: string): UnavailableState {
		return { name: 'unavailable', reason };
	}

	function loginState(errorMessage?: string): UserLoginState {
		const state: UserLoginState = {
			name: 'login',
			errorMessage,
			async login({ login, password }) {
				try {
					const field = login.includes('@') ? 'email' : 'username';
					const result = await request<{ twoFactorRedirect?: boolean }>(`sign-in/${field}`, {
						[field]: login.trim(),
						password
					});
					if (result.twoFactorRedirect) return setState(mfaVerificationState());
					return setState(authenticatedState(await fetchUser()));
				} catch {
					return setState(loginState('Identifiants invalides.'));
				}
			},
			async toRegistration() {
				return setState(registrationState());
			}
		};
		return mode === 'mfa+passkey' ? withPasskeyLogin(state) : state;
	}

	function withPasskeyLogin(state: UserLoginState): PasskeyLoginState {
		return Object.assign(state, {
			async loginWithPasskey(mediation: 'conditional' | 'modal', signal?: AbortSignal) {
				const ceremony: Ceremony = { type: 'authentication' };
				try {
					const options = await request<PublicKeyCredentialRequestOptionsJSON>(
						'passkey/generate-authenticate-options'
					);
					ceremony.options = options;
					const credential = await navigator.credentials.get({
						publicKey: PublicKeyCredential.parseRequestOptionsFromJSON(options),
						// Fenêtre modale : comportement par défaut du navigateur (mediation « optional »)
						mediation: mediation === 'conditional' ? 'conditional' : 'optional',
						signal
					});
					if (!(credential instanceof PublicKeyCredential)) throw new Error('Aucune passkey');
					ceremony.credential = credential.toJSON();
					ceremony.verification = await request('passkey/verify-authentication', {
						response: ceremony.credential
					});
					callbacks.onCeremony?.(ceremony);
					return setState(authenticatedState(await fetchUser()));
				} catch (error) {
					// Conditional UI abandonnée (diapo quittée, autre connexion) ou passkey pas encore
					// choisie : rien à signaler, l'état ne change pas
					if (signal?.aborted || (mediation === 'conditional' && !ceremony.credential)) {
						return state;
					}
					ceremony.error = describeError(error);
					callbacks.onCeremony?.(ceremony);
					return setState(loginState('Connexion par passkey impossible.'));
				}
			}
		});
	}

	function registrationState(errorMessage?: string): UserRegistrationState {
		return {
			name: 'registration',
			errorMessage,
			async registerUser({ displayName, username, email, password }) {
				try {
					await request('sign-up/email', { name: displayName, username, email, password });
					return setState(loginState());
				} catch {
					return setState(registrationState('Inscription impossible.'));
				}
			},
			async toLogin() {
				return setState(loginState());
			}
		};
	}

	function authenticatedState(
		user: UserInfo,
		errorMessage?: string,
		infoMessage?: string
	): AuthenticatedState {
		const state: AuthenticatedState = {
			name: 'authenticated',
			user,
			errorMessage,
			async logout() {
				// Même en cas d'échec, retour au login : une nouvelle connexion remplacera la session
				await request('sign-out', {}).catch(() => undefined);
				return setState(loginState());
			},
			async setupMfa(password) {
				try {
					const { totpURI } = await request<{ totpURI: string }>('two-factor/enable', {
						password
					});
					return setState(mfaSetupState(user, totpURI));
				} catch {
					return setState(authenticatedState(user, 'Mot de passe incorrect.'));
				}
			}
		};
		return mode === 'mfa+passkey' ? withPasskeyAddition(state, infoMessage) : state;
	}

	function withPasskeyAddition(
		state: AuthenticatedState,
		infoMessage?: string
	): PasskeyAuthenticatedState {
		return Object.assign(state, {
			infoMessage,
			async addPasskey(name: string) {
				const ceremony: Ceremony = { type: 'registration' };
				try {
					const options = await request<PublicKeyCredentialCreationOptionsJSON>(
						'passkey/generate-register-options'
					);
					ceremony.options = options;
					const credential = await navigator.credentials.create({
						publicKey: PublicKeyCredential.parseCreationOptionsFromJSON(options)
					});
					if (!(credential instanceof PublicKeyCredential)) throw new Error('Aucune passkey');
					ceremony.credential = credential.toJSON();
					ceremony.verification = await request('passkey/verify-registration', {
						response: ceremony.credential,
						name: name.trim()
					});
					callbacks.onCeremony?.(ceremony);
					return setState(authenticatedState(state.user, undefined, 'Passkey ajoutée.'));
				} catch (error) {
					ceremony.error = describeError(error);
					callbacks.onCeremony?.(ceremony);
					return setState(authenticatedState(state.user, 'Ajout de la passkey impossible.'));
				}
			}
		});
	}

	function mfaSetupState(user: UserInfo, totpURI: string, errorMessage?: string): MfaSetupState {
		return {
			name: 'mfa-setup',
			totpURI,
			errorMessage,
			async cancel() {
				return setState(authenticatedState(user));
			},
			async verifyTotp(totp) {
				try {
					await request('two-factor/verify-totp', { code: totp.trim() });
					return setState(authenticatedState(await fetchUser()));
				} catch {
					return setState(mfaSetupState(user, totpURI, 'Code invalide.'));
				}
			}
		};
	}

	function mfaVerificationState(errorMessage?: string): MfaVerificationState {
		return {
			name: 'mfa-verification',
			errorMessage,
			async verifyTotp(totp) {
				try {
					await request('two-factor/verify-totp', { code: totp.trim() });
					return setState(authenticatedState(await fetchUser()));
				} catch {
					return setState(mfaVerificationState('Code invalide.'));
				}
			}
		};
	}

	return () => authenticationState;
}

/**
 * Un état réactif par mode. Réactif tant qu'il est lu dans un contexte réactif :
 * `const auth = $derived(getMfaDemoState());`
 */
export const getMfaDemoState = createHybridDemo('mfa');
export const getPasskeyDemoState = createHybridDemo('mfa+passkey');
