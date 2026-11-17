import { api } from './form.js';

export async function addPasskey() {
	const options = await api('passkey/generate-register-options');
	const credential = await navigator.credentials.create({
		publicKey: PublicKeyCredential.parseCreationOptionsFromJSON(options)
	});
	return api('passkey/verify-registration', { response: credential.toJSON() });
}

export async function selectPasskey(signal) {
	const options = await api('passkey/generate-authenticate-options');
	const credential = await navigator.credentials.get({
		publicKey: PublicKeyCredential.parseRequestOptionsFromJSON(options),
		mediation: 'conditional',
		signal
	});
	return credential?.toJSON();
}
