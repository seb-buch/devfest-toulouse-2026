import type { Ceremony } from '#lib/demos/demo-hybrid.svelte.ts';

/*
 * Données échangées pendant les cérémonies, telles qu'affichées dans les diapos.
 * Tant que la démo n'a pas tourné (ou en mode offline), on affiche un exemple réaliste.
 */

export type RegistrationOptions = {
	challenge: string;
	rp: { id?: string; name: string };
	user: { id: string; name: string; displayName: string };
	pubKeyCredParams: { type: string; alg: number }[];
	excludeCredentials?: { id: string; type?: string; transports?: string[] }[];
	authenticatorSelection?: {
		residentKey?: string;
		userVerification?: string;
		requireResidentKey?: boolean;
	};
	attestation?: string;
	timeout?: number;
	extensions?: Record<string, unknown>;
	hints?: string[];
};

/*  Sortie de credential.toJSON(), champs dans l'ordre où le navigateur les renvoie  */
export type RegistrationCredential = {
	authenticatorAttachment?: string;
	clientExtensionResults: Record<string, unknown>;
	id: string;
	rawId: string;
	response: {
		attestationObject: string;
		authenticatorData: string;
		clientDataJSON: string;
		publicKey?: string;
		publicKeyAlgorithm: number;
		transports?: string[];
	};
	type: string;
};

export type AuthenticationOptions = {
	challenge: string;
	rpId?: string;
	allowCredentials?: { id: string }[];
	userVerification?: string;
	timeout?: number;
};

export type AuthenticationCredential = {
	authenticatorAttachment?: string;
	clientExtensionResults: Record<string, unknown>;
	id: string;
	rawId: string;
	response: {
		authenticatorData: string;
		clientDataJSON: string;
		signature: string;
		userHandle?: string;
	};
	type: string;
};

export type Exchange<Options, Credential> = {
	options: Options;
	credential: Credential;
	/** false : exemple affiché faute de cérémonie réussie */
	live: boolean;
};

export function registrationExchange(
	ceremony?: Ceremony
): Exchange<RegistrationOptions, RegistrationCredential> {
	if (!isSuccessful(ceremony)) return EXAMPLE_REGISTRATION;
	return {
		options: ceremony.options as RegistrationOptions,
		credential: ceremony.credential as RegistrationCredential,
		live: true
	};
}

export function authenticationExchange(
	ceremony?: Ceremony
): Exchange<AuthenticationOptions, AuthenticationCredential> {
	if (!isSuccessful(ceremony)) return EXAMPLE_AUTHENTICATION;
	return {
		options: ceremony.options as AuthenticationOptions,
		credential: ceremony.credential as AuthenticationCredential,
		live: true
	};
}

function isSuccessful(ceremony?: Ceremony): ceremony is Ceremony {
	return ceremony?.options !== undefined && ceremony.credential !== undefined && !ceremony.error;
}

/*
 * Exemples : cérémonies réelles capturées depuis la démo (console en mode dev), avec 1Password.
 * Ne pas les modifier à la main : les champs encodés doivent rester décodables et cohérents.
 */

const CREDENTIAL_ID = 'BwXpY0RD9AL_pUryFNiGrBISyfvrHJ-MuLzq2snbHc8JM_JJGb3Vgfph4VAfIyBEDQ';
const USER_ID = 'bWFlaW03MjdwZzZiNHY2ZXFienBwMWkxbTlrbDBkeXo';

const EXAMPLE_REGISTRATION: Exchange<RegistrationOptions, RegistrationCredential> = {
	live: false,
	options: {
		challenge: 'wB-9x4Dr1ZxNZCm2s0VSdtbc0nqV_-BpGfSRDrNlnEY',
		rp: { name: 'Hybrid Auth Demo', id: 'gta-passkeys-city.demo' },
		user: {
			id: USER_ID,
			name: 'seb.buchoux@example.com',
			displayName: 'seb.buchoux@example.com'
		},
		pubKeyCredParams: [-8, -7, -257].map((alg) => ({ alg, type: 'public-key' })),
		timeout: 60000,
		attestation: 'none',
		excludeCredentials: [
			{
				id: 'SPoo4t9tI2yxCGqOmJxPWINqO0vFH6jbrkhPy00XaDQ',
				transports: ['internal'],
				type: 'public-key'
			}
		],
		authenticatorSelection: {
			residentKey: 'required',
			userVerification: 'preferred',
			requireResidentKey: true
		},
		extensions: { credProps: true },
		hints: []
	},
	credential: {
		authenticatorAttachment: 'platform',
		clientExtensionResults: { credProps: { rk: true } },
		id: CREDENTIAL_ID,
		rawId: CREDENTIAL_ID,
		response: {
			attestationObject:
				'o2NmbXRkbm9uZWdhdHRTdG10oGhhdXRoRGF0YVi1qWO1A7pX2Q_UpEoUaILhh3cHTGNcONF05t--Uz8BlD5ZAAAAALraVWanqkAfvZZFYZpVEg0AMQcF6WNEQ_QC_6VK8hTYhqwSEsn76xyfjLi86trJ2x3PCTPySRm91YH6YeFQHyMgRA2lAQIDJiABIVggDeuDBgdWFyxL7dV5K_PxS6La0sz6g7DsUGmMpkvbd6ciWCDCj_Pq8V7DU583AO1d7sFtOd_hsbwrLPjEeDRnJdqgeA',
			authenticatorData:
				'qWO1A7pX2Q_UpEoUaILhh3cHTGNcONF05t--Uz8BlD5ZAAAAALraVWanqkAfvZZFYZpVEg0AMQcF6WNEQ_QC_6VK8hTYhqwSEsn76xyfjLi86trJ2x3PCTPySRm91YH6YeFQHyMgRA2lAQIDJiABIVggDeuDBgdWFyxL7dV5K_PxS6La0sz6g7DsUGmMpkvbd6ciWCDCj_Pq8V7DU583AO1d7sFtOd_hsbwrLPjEeDRnJdqgeA',
			clientDataJSON:
				'eyJ0eXBlIjoid2ViYXV0aG4uY3JlYXRlIiwiY2hhbGxlbmdlIjoid0ItOXg0RHIxWnhOWkNtMnMwVlNkdGJjMG5xVl8tQnBHZlNSRHJObG5FWSIsIm9yaWdpbiI6Imh0dHBzOi8vZ3RhLXBhc3NrZXlzLWNpdHkuZGVtbyIsImNyb3NzT3JpZ2luIjpmYWxzZX0',
			publicKey:
				'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEDeuDBgdWFyxL7dV5K_PxS6La0sz6g7DsUGmMpkvbd6fCj_Pq8V7DU583AO1d7sFtOd_hsbwrLPjEeDRnJdqgeA',
			publicKeyAlgorithm: -7,
			transports: ['hybrid', 'internal']
		},
		type: 'public-key'
	}
};

const EXAMPLE_AUTHENTICATION: Exchange<AuthenticationOptions, AuthenticationCredential> = {
	live: false,
	options: {
		rpId: 'gta-passkeys-city.demo',
		challenge: 'XfxL1W0yWVvS2-uPfp7giqMhp99dhn72mPno_Bfy1XQ',
		timeout: 60000,
		userVerification: 'preferred'
	},
	credential: {
		authenticatorAttachment: 'platform',
		clientExtensionResults: {},
		id: CREDENTIAL_ID,
		rawId: CREDENTIAL_ID,
		response: {
			authenticatorData: 'qWO1A7pX2Q_UpEoUaILhh3cHTGNcONF05t--Uz8BlD4ZAAAAAA',
			clientDataJSON:
				'eyJ0eXBlIjoid2ViYXV0aG4uZ2V0IiwiY2hhbGxlbmdlIjoiWGZ4TDFXMHlXVnZTMi11UGZwN2dpcU1ocDk5ZGhuNzJtUG5vX0JmeTFYUSIsIm9yaWdpbiI6Imh0dHBzOi8vZ3RhLXBhc3NrZXlzLWNpdHkuZGVtbyIsImNyb3NzT3JpZ2luIjpmYWxzZX0',
			signature:
				'MEQCICGxXs0zfq8nR4zwtNSk079Aac81qDL5f0FS4hgqW2XJAiBfIxaJl7X4eEdQRxRuhZ-W252AGSGPh5oiwXTNRKJ_Pg',
			userHandle: USER_ID
		},
		type: 'public-key'
	}
};
