/*
 * Décodage des champs binaires (base64url) d'une réponse WebAuthn, pour les afficher en clair
 * dans les diapos. Aucune vérification ici : c'est le travail du serveur.
 */

export type ClientData = {
	type: string;
	challenge: string;
	origin: string;
	crossOrigin?: boolean;
};

export type AuthenticatorData = {
	rpIdHash: string;
	flags: string[];
	signCount: number;
	/** Présent à l'enregistrement (flag AT) : la passkey créée */
	attestedCredentialData?: {
		aaguid: string;
		credentialId: string;
		credentialPublicKey: string;
	};
};

/*  Bits de l'octet « flags » de authenticatorData (§6.1)  */
const FLAGS: [bit: number, name: string][] = [
	[0x01, 'UP'], // User Present
	[0x04, 'UV'], // User Verified
	[0x08, 'BE'], // Backup Eligible
	[0x10, 'BS'], // Backup State
	[0x40, 'AT'], // Attested credential data
	[0x80, 'ED'] // Extension data
];

/*  Identifiants COSE des algorithmes de signature  */
const ALGORITHMS: Record<number, string> = {
	[-7]: 'ES256',
	[-8]: 'EdDSA',
	[-48]: 'ML-DSA-44',
	[-257]: 'RS256'
};

export function base64urlToBytes(value: string): Uint8Array {
	const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
	return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
}

export function bytesToBase64url(bytes: Uint8Array): string {
	const base64 = btoa(String.fromCharCode(...bytes));
	return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeClientData(clientDataJSON: string): ClientData {
	return JSON.parse(new TextDecoder().decode(base64urlToBytes(clientDataJSON)));
}

/*  rpIdHash (32 octets) · flags (1 octet) · signCount (4 octets, big-endian) · données de la passkey  */
export function decodeAuthenticatorData(authenticatorData: string): AuthenticatorData {
	const bytes = base64urlToBytes(authenticatorData);
	const flags = bytes[32];
	return {
		rpIdHash: toHex(bytes.slice(0, 32)),
		flags: FLAGS.filter(([bit]) => flags & bit).map(([, name]) => name),
		signCount: new DataView(bytes.buffer, bytes.byteOffset).getUint32(33),
		...(flags & 0x40 && { attestedCredentialData: decodeAttestedCredentialData(bytes) })
	};
}

/*  aaguid (16 octets) · longueur de l'identifiant (2 octets) · identifiant · clé publique COSE  */
function decodeAttestedCredentialData(bytes: Uint8Array) {
	const idLength = new DataView(bytes.buffer, bytes.byteOffset).getUint16(53);
	const idEnd = 55 + idLength;
	return {
		aaguid: toUuid(toHex(bytes.slice(37, 53))),
		credentialId: bytesToBase64url(bytes.slice(55, idEnd)),
		credentialPublicKey: bytesToBase64url(bytes.slice(idEnd)) // suppose l'absence d'extensions (flag ED)
	};
}

function toUuid(hex: string): string {
	return [
		hex.slice(0, 8),
		hex.slice(8, 12),
		hex.slice(12, 16),
		hex.slice(16, 20),
		hex.slice(20)
	].join('-');
}

export function decodeText(value: string): string {
	return new TextDecoder().decode(base64urlToBytes(value));
}

export function algorithmName(id: number): string {
	return ALGORITHMS[id] ?? `alg ${id}`;
}

function toHex(bytes: Uint8Array): string {
	return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}
