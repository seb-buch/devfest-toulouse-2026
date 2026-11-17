// @ts-nocheck
import { verifyAuthenticationResponse } from '@simplewebauthn/server';

async function verifyLogin(response) {
	const expectedChallenge = await challenges.consume(challengeOf(response));

	const { user, passkey } = await db.findPasskey(response.id);
	if (response.response.userHandle !== user.webAuthnUserID) {
		throw new Error('Passkey refusée');
	}

	const { verified, authenticationInfo } =
		await verifyAuthenticationResponse({
			response,
			expectedChallenge,
			expectedOrigin: 'https://gta-passkeys-city.demo',
			expectedRPID: 'gta-passkeys-city.demo',
			credential: passkey,
			requireUserVerification: false
		});
	if (!verified) throw new Error('Passkey refusée');

	await db.updatePasskey(passkey.id, authenticationInfo);
	return user;
}
