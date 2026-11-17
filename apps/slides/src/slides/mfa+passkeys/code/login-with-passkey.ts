// @ts-nocheck
async function loginWithPasskey(signal) {
	if (!(await PublicKeyCredential.isConditionalMediationAvailable()))
		return;

	const options = await api.get('passkey/generate-authenticate-options');

	const credential = await navigator.credentials.get({
		publicKey: PublicKeyCredential.parseRequestOptionsFromJSON(options),
		mediation: 'conditional',
		signal
	});

	await api.post('passkey/verify-authentication', {
		response: credential.toJSON()
	});
}
