import { api } from './form.js';

// Provided by the server: on a related origin, the RP ID is another domain than the page one.
const rpId = document.querySelector('meta[name="rp-id"]').content;

async function createCredential(options) {
	const credential = await navigator.credentials.create({
		publicKey: PublicKeyCredential.parseCreationOptionsFromJSON(options)
	});
	return credential.toJSON();
}

export async function signUp(user) {
	const options = await api('register/options', { body: user });
	return api('register/verify', { body: await createCredential(options) });
}

export async function addPasskey(passkeyName) {
	const options = await api('me/passkeys/register/options', { body: { passkeyName } });
	return api('me/passkeys/register/verify', { body: await createCredential(options) });
}

export async function recoverAccount(token, passkeyName) {
	const options = await api('recovery/register/options', { body: { token, passkeyName } });
	const response = await createCredential(options);
	return api('recovery/register/verify', { body: { token, response } });
}

/** mediation 'conditional': passkeys offered in the username field autofill. */
export async function signIn({ username, mediation, signal } = {}) {
	const options = await api('authenticate/options', { body: username ? { username } : {} });
	const credential = await navigator.credentials.get({
		publicKey: PublicKeyCredential.parseRequestOptionsFromJSON(options),
		mediation,
		signal
	});
	if (!credential) return null;
	try {
		return await api('authenticate/verify', { body: credential.toJSON() });
	} catch (error) {
		if (error.status === 404) {
			// Deleted on the server: the passkey provider can stop offering it.
			await sendSignal('signalUnknownCredential', { rpId, credentialId: credential.id });
		}
		throw error;
	}
}

/**
 * Signed-in user: passkeys missing from the list are hidden by the passkey provider,
 * and the names it displays are updated.
 */
export async function signalAccount(user, passkeys) {
	const userId = user.webAuthnUserID;
	await sendSignal('signalAllAcceptedCredentials', {
		rpId,
		userId,
		allAcceptedCredentialIds: passkeys.map((passkey) => passkey.credentialId)
	});
	await sendSignal('signalCurrentUserDetails', {
		rpId,
		userId,
		name: user.username,
		displayName: user.displayName
	});
}

/**
 * Signal API (WebAuthn level 3): keeps the passkey provider in sync with the server.
 * The promise never tells whether the provider acted on the signal.
 */
async function sendSignal(method, options) {
	if (!PublicKeyCredential[method]) {
		console.warn(`Signal API : ${method} non disponible dans ce navigateur`);
		return;
	}
	try {
		await PublicKeyCredential[method](options);
		console.info(`Signal API : ${method}`, options);
	} catch (error) {
		console.error(`Signal API : ${method} a échoué`, error, options);
	}
}

export function defaultPasskeyName() {
	const platform = navigator.userAgentData?.platform;
	return platform ? `Passkey ${platform}` : 'Passkey';
}
