import { Hono } from 'hono';
import QRCode from 'qrcode';

const ui = new Hono();
const page = await Bun.file(`${import.meta.dir}/page.html`).text();

ui.get('/', (c) => c.html(page));

for (const file of ['app.js', 'form.js', 'forms.js', 'passkey.js', 'style.css']) {
	ui.get(`/${file}`, () => new Response(Bun.file(`${import.meta.dir}/${file}`)));
}

ui.post('/qr', async (c) => {
	const { uri } = await c.req.json();
	if (typeof uri !== 'string' || !uri.startsWith('otpauth://totp/') || uri.length > 2048) {
		return c.json({ message: 'URI TOTP invalide' }, 400);
	}
	c.header('Cache-Control', 'no-store');
	return c.json({ image: await QRCode.toDataURL(uri, { width: 220 }) });
});

export default ui;
