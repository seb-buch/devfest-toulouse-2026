// @ts-nocheck
import { generateRegistrationOptions } from '@simplewebauthn/server';

async function startPasskeyAddition(user: User) {
	const existingCredentials = await db.findCredentials(user.id);

	const options = await generateRegistrationOptions({
		rpID: 'gta-passkeys-city.demo',
		rpName: 'GTA Passkeys City',
		userID: user.webAuthnUserID,
		userName: user.username,
		userDisplayName: user.displayName,
		excludeCredentials: existingCredentials,
		authenticatorSelection: {
			residentKey: 'required',
			userVerification: 'preferred'
		},
		attestationType: 'none'
	});

	await challenges.save(user.id, options.challenge);
	return options;
}
