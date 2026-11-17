// @ts-nocheck
import { generateAuthenticationOptions } from '@simplewebauthn/server';

async function startLogin() {
	const options = await generateAuthenticationOptions({
		rpID: 'gta-passkeys-city.demo',
		allowCredentials: [],
		userVerification: 'preferred'
	});

	await challenges.save(options.challenge);
	return options;
}
