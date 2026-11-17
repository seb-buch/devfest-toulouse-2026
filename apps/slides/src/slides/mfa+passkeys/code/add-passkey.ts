// @ts-nocheck
async function addPasskey() {
	const options = await api.get('passkey/generate-register-options');

	const credential = await navigator.credentials.create({
		publicKey: PublicKeyCredential.parseCreationOptionsFromJSON(options)
	});

	await api.post('passkey/verify-registration', {
		response: credential.toJSON()
	});
}
