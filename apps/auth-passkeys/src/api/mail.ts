import { createTransport } from 'nodemailer';
import { config } from '../config';
import type { UserInfo } from './types';

const transport = createTransport({
	host: config.smtp.host,
	port: config.smtp.port,
	secure: false,
	ignoreTLS: true // Mailpit, local only.
});

export async function sendRecoveryEmail(user: UserInfo, link: string): Promise<void> {
	const minutes = config.recoveryTokenTtlMs / 60_000;
	const expiry = `Ce lien est valable ${minutes} minutes et ne fonctionne qu’une fois.`;
	const ignore = 'Si vous n’êtes pas à l’origine de cette demande, ignorez cet email.';
	await transport.sendMail({
		from: config.mailFrom,
		to: user.email,
		subject: 'Récupération de votre compte',
		text: [
			`Bonjour ${user.displayName},`,
			'',
			'Pour créer une nouvelle passkey et retrouver l’accès à votre compte, ouvrez ce lien :',
			link,
			'',
			expiry,
			ignore
		].join('\n'),
		html: [
			`<p>Bonjour ${escapeHtml(user.displayName)},</p>`,
			'<p>Pour retrouver l’accès à votre compte, créez une nouvelle passkey :</p>',
			`<p><a href="${escapeHtml(link)}">Créer une nouvelle passkey</a></p>`,
			`<p>${expiry}<br>${ignore}</p>`
		].join('\n')
	});
}

function escapeHtml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;');
}
