import { apiAvailable } from '#lib/api.ts';

/*  Modèles renvoyés par l'API de auth-passkeys  */

export type User = {
	id: string;
	webAuthnUserID: string;
	username: string;
	displayName: string;
	email: string;
};

export type Passkey = {
	credentialId: string;
	name: string;
	deviceType: 'singleDevice' | 'multiDevice';
	backedUp: boolean;
	createdAt: number;
	lastUsedAt: number | null;
};

export type NewUser = {
	username: string;
	displayName: string;
	email: string;
	passkeyName: string;
};

/*  États de la démo : chaque état porte ses propres transitions  */

export type InitialState = {
	name: 'initial';
	initialize(): Promise<LoginState | AuthenticatedState | UnavailableState>;
};

export type UnavailableState = {
	name: 'unavailable';
	reason: string;
};

export type LoginState = {
	name: 'login';
	errorMessage?: string;

	/** Sans identifiant : la passkey est découverte par l'authentificateur */
	signIn(
		username: string,
		mediation: 'conditional' | 'modal',
		signal?: AbortSignal
	): Promise<AuthenticatedState | LoginState>;
	toRegistration(): Promise<RegistrationState>;
	toRecovery(): Promise<RecoveryRequestState>;
};

export type RegistrationState = {
	name: 'registration';
	errorMessage?: string;

	register(user: NewUser): Promise<AuthenticatedState | RegistrationState>;
	toLogin(): Promise<LoginState>;
};

export type AuthenticatedState = {
	name: 'authenticated';
	user: User;
	passkeys: Passkey[];
	errorMessage?: string;
	infoMessage?: string;

	addPasskey(name: string): Promise<AuthenticatedState>;
	deletePasskey(credentialId: string): Promise<AuthenticatedState>;
	logout(): Promise<LoginState>;
};

export type RecoveryRequestState = {
	name: 'recovery-request';
	errorMessage?: string;

	requestRecovery(email: string): Promise<RecoverySentState | RecoveryRequestState>;
	toLogin(): Promise<LoginState>;
};

/*  Lien envoyé : il se lit dans Mailpit, son onglet relais renvoie le token ici  */
export type RecoverySentState = {
	name: 'recovery-sent';
	email: string;

	toLogin(): Promise<LoginState>;
};

export type RecoveryState = {
	name: 'recovery';
	errorMessage?: string;

	recoverAccount(passkeyName: string): Promise<AuthenticatedState | RecoveryState>;
	toLogin(): Promise<LoginState>;
};

export type PasskeysDemoState =
	| InitialState
	| UnavailableState
	| LoginState
	| RegistrationState
	| AuthenticatedState
	| RecoveryRequestState
	| RecoverySentState
	| RecoveryState;

/*  Communication avec l'API de auth-passkeys (même origine, via Caddy)  */

const API_URL = '/passkeys/api';

class ApiError extends Error {
	constructor(
		readonly status: number,
		readonly body: unknown
	) {
		super(`Erreur ${status}`);
	}
}

type RequestOptions = { method?: 'GET' | 'POST' | 'DELETE'; body?: unknown };

export async function request<T>(path: string, { method, body }: RequestOptions = {}): Promise<T> {
	const response = await fetch(`${API_URL}/${path}`, {
		method: method ?? (body ? 'POST' : 'GET'),
		headers: body ? { 'Content-Type': 'application/json' } : {},
		body: body ? JSON.stringify(body) : undefined,
		cache: 'no-store'
	});
	// 202 (récupération) et 204 (déconnexion) : pas de corps
	const data = response.status === 202 || response.status === 204 ? null : await response.json();
	if (!response.ok) throw new ApiError(response.status, data);
	return data as T;
}

/*  Cérémonies WebAuthn : API natives du navigateur  */

async function createPasskey(options: PublicKeyCredentialCreationOptionsJSON) {
	const credential = await navigator.credentials.create({
		publicKey: PublicKeyCredential.parseCreationOptionsFromJSON(options)
	});
	if (!(credential instanceof PublicKeyCredential)) throw new Error('Aucune passkey');
	return credential.toJSON();
}

async function getPasskey(
	options: PublicKeyCredentialRequestOptionsJSON,
	mediation: 'conditional' | 'modal',
	signal?: AbortSignal
) {
	const credential = await navigator.credentials.get({
		publicKey: PublicKeyCredential.parseRequestOptionsFromJSON(options),
		// Fenêtre modale : comportement par défaut du navigateur (mediation « optional »)
		mediation: mediation === 'conditional' ? 'conditional' : 'optional',
		signal
	});
	if (!(credential instanceof PublicKeyCredential)) throw new Error('Aucune passkey');
	return credential;
}

/*
 * Signal API (WebAuthn level 3) : tient le gestionnaire de passkeys à jour.
 * La promesse ne dit jamais si le gestionnaire a tenu compte du signal.
 */

const rpId = () => location.hostname;

type SignalMethod =
	'signalUnknownCredential' | 'signalAllAcceptedCredentials' | 'signalCurrentUserDetails';

async function sendSignal(method: SignalMethod, options: object) {
	const signal = (PublicKeyCredential as unknown as Record<string, unknown>)[method];
	if (typeof signal !== 'function') {
		console.warn(`Signal API : ${method} non disponible dans ce navigateur`);
		return;
	}
	try {
		await signal.call(PublicKeyCredential, options);
		console.info(`Signal API : ${method}`, options);
	} catch (error) {
		console.error(`Signal API : ${method} a échoué`, error, options);
	}
}

async function signalAccount(user: User, passkeys: Passkey[]) {
	const userId = user.webAuthnUserID;
	await sendSignal('signalAllAcceptedCredentials', {
		rpId: rpId(),
		userId,
		allAcceptedCredentialIds: passkeys.map(({ credentialId }) => credentialId)
	});
	await sendSignal('signalCurrentUserDetails', {
		rpId: rpId(),
		userId,
		name: user.username,
		displayName: user.displayName
	});
}

/*  Construction des états  */

/*
 * Lien de récupération : /presentation/#token=…
 * Lu au chargement du module, avant que Slyd ne remplace le hash par le numéro de diapo.
 */
export const recoveryToken =
	// eslint-disable-next-line svelte/prefer-svelte-reactivity -- lecture ponctuelle, pas un état réactif
	new URLSearchParams(globalThis.location?.hash.slice(1)).get('token') ?? undefined;

function createPasskeysDemo(): () => PasskeysDemoState {
	let demoState: PasskeysDemoState = $state.raw({ name: 'initial', initialize });

	function setState<State extends PasskeysDemoState>(state: State): State {
		demoState = state;
		return state;
	}

	async function initialize() {
		if (!apiAvailable) return setState(unavailableState('API désactivée (mode offline)'));
		try {
			await request('health');
		} catch {
			return setState(unavailableState('API injoignable'));
		}
		// Session encore ouverte (rechargement de la page) : on reprend sur le compte
		try {
			return await showAccount(await request<User>('me'));
		} catch {
			return setState(loginState());
		}
	}

	function unavailableState(reason: string): UnavailableState {
		return { name: 'unavailable', reason };
	}

	async function showAccount(user: User, infoMessage?: string) {
		const passkeys = await request<Passkey[]>('me/passkeys');
		void signalAccount(user, passkeys);
		return setState(authenticatedState(user, passkeys, { infoMessage }));
	}

	function loginState(errorMessage?: string): LoginState {
		const state: LoginState = {
			name: 'login',
			errorMessage,
			async signIn(username, mediation, signal) {
				let credential: PublicKeyCredential | undefined;
				try {
					const options = await request<PublicKeyCredentialRequestOptionsJSON>(
						'authenticate/options',
						{ body: username.trim() ? { username: username.trim() } : {} }
					);
					credential = await getPasskey(options, mediation, signal);
					const user = await request<User>('authenticate/verify', { body: credential.toJSON() });
					return await showAccount(user);
				} catch (error) {
					// Conditional UI abandonnée (diapo quittée, autre connexion) : l'état ne change pas
					if (signal?.aborted || (mediation === 'conditional' && !credential)) return state;
					if (error instanceof ApiError && error.status === 404 && credential) {
						// Passkey supprimée côté serveur : le gestionnaire peut cesser de la proposer
						await sendSignal('signalUnknownCredential', {
							rpId: rpId(),
							credentialId: credential.id
						});
						return setState(loginState('Cette passkey n’est plus valable.'));
					}
					return setState(loginState('Connexion par passkey impossible.'));
				}
			},
			async toRegistration() {
				return setState(registrationState());
			},
			async toRecovery() {
				return setState(recoveryRequestState());
			}
		};
		return state;
	}

	function registrationState(errorMessage?: string): RegistrationState {
		return {
			name: 'registration',
			errorMessage,
			async register({ passkeyName, ...user }) {
				try {
					const options = await request<PublicKeyCredentialCreationOptionsJSON>(
						'register/options',
						{ body: { ...user, passkeyName } }
					);
					const response = await createPasskey(options);
					return await showAccount(await request<User>('register/verify', { body: response }));
				} catch (error) {
					const message =
						error instanceof ApiError && error.status === 409
							? 'Identifiant ou email déjà utilisé.'
							: 'Création du compte impossible.';
					return setState(registrationState(message));
				}
			},
			async toLogin() {
				return setState(loginState());
			}
		};
	}

	type Messages = { errorMessage?: string; infoMessage?: string };

	function authenticatedState(
		user: User,
		passkeys: Passkey[],
		{ errorMessage, infoMessage }: Messages = {}
	): AuthenticatedState {
		return {
			name: 'authenticated',
			user,
			passkeys,
			errorMessage,
			infoMessage,
			async addPasskey(name) {
				try {
					const options = await request<PublicKeyCredentialCreationOptionsJSON>(
						'me/passkeys/register/options',
						{ body: { passkeyName: name.trim() } }
					);
					const response = await createPasskey(options);
					await request('me/passkeys/register/verify', { body: response });
					return await showAccount(user, 'Passkey ajoutée.');
				} catch (error) {
					// excludeCredentials : l'authentificateur détient déjà une passkey du compte
					const message =
						error instanceof DOMException && error.name === 'InvalidStateError'
							? 'Cet authentificateur a déjà une passkey pour ce compte.'
							: 'Ajout de la passkey impossible.';
					return setState(authenticatedState(user, passkeys, { errorMessage: message }));
				}
			},
			async deletePasskey(credentialId) {
				try {
					const remaining = await request<Passkey[]>(`me/passkeys/${credentialId}`, {
						method: 'DELETE'
					});
					void signalAccount(user, remaining);
					return setState(
						authenticatedState(user, remaining, { infoMessage: 'Passkey supprimée.' })
					);
				} catch (error) {
					const message =
						error instanceof ApiError && error.status === 409
							? 'Impossible de supprimer la dernière passkey.'
							: 'Suppression impossible.';
					return setState(authenticatedState(user, passkeys, { errorMessage: message }));
				}
			},
			async logout() {
				// Même en cas d'échec, retour au login : une nouvelle connexion remplacera la session
				await request('logout', { body: {} }).catch(() => undefined);
				return setState(loginState());
			}
		};
	}

	function recoveryRequestState(errorMessage?: string): RecoveryRequestState {
		return {
			name: 'recovery-request',
			errorMessage,
			async requestRecovery(email) {
				try {
					await request('recovery/request', { body: { email: email.trim() } });
					return setState(recoverySentState(email.trim()));
				} catch {
					return setState(recoveryRequestState('Demande impossible.'));
				}
			},
			async toLogin() {
				return setState(loginState());
			}
		};
	}

	function recoverySentState(email: string): RecoverySentState {
		return {
			name: 'recovery-sent',
			email,
			async toLogin() {
				return setState(loginState());
			}
		};
	}

	function recoveryState(token: string, errorMessage?: string): RecoveryState {
		return {
			name: 'recovery',
			errorMessage,
			async recoverAccount(passkeyName) {
				try {
					const options = await request<PublicKeyCredentialCreationOptionsJSON>(
						'recovery/register/options',
						{ body: { token, passkeyName: passkeyName.trim() } }
					);
					const response = await createPasskey(options);
					const user = await request<User>('recovery/register/verify', {
						body: { token, response }
					});
					return await showAccount(user, 'Nouvelle passkey créée, compte récupéré.');
				} catch (error) {
					const message =
						error instanceof DOMException && error.name === 'InvalidStateError'
							? 'Cet authentificateur a déjà une passkey pour ce compte.'
							: 'Lien invalide, expiré ou déjà utilisé.';
					return setState(recoveryState(token, message));
				}
			},
			async toLogin() {
				return setState(loginState());
			}
		};
	}

	// Présentation ouverte par le lien du mail : la démo commence par la création de passkey
	if (apiAvailable && recoveryToken) setState(recoveryState(recoveryToken));

	return () => demoState;
}

/**
 * État réactif partagé par toutes les diapos de la section.
 * Réactif tant qu'il est lu dans un contexte réactif : `const auth = $derived(getPasskeysDemoState());`
 */
export const getPasskeysDemoState = createPasskeysDemo();
