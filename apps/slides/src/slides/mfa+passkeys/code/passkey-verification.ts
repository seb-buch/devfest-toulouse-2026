// @ts-nocheck
import { verifyRegistrationResponse } from '@simplewebauthn/server';

async function verifyPasskeyAddition(user: User, response) {
	const expectedChallenge = await challenges.consume(user.id);

	const { verified, registrationInfo } = await verifyRegistrationResponse({
		response,
		expectedChallenge,
		expectedOrigin: 'https://gta-passkeys-city.demo',
		expectedRPID: 'gta-passkeys-city.demo',
		requireUserVerification: false
	});
	if (!verified) throw new Error('Passkey refusée');

	const { credential } = registrationInfo;
	await db.savePasskey(user.id, credential);
}
