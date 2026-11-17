import { Hono } from 'hono';
import { config } from '../config';

const FILES = ['app.js', 'form.js', 'forms.js', 'passkey.js', 'style.css'];

const ui = new Hono();

// The RP ID is not always the page domain (Related Origin Requests): the server provides it.
ui.get('/', async (c) => {
	const page = await Bun.file(`${import.meta.dir}/page.html`).text();
	return c.html(page.replace('{{RP_ID}}', config.rpId));
});
for (const file of FILES) {
	ui.get(`/${file}`, () => new Response(Bun.file(`${import.meta.dir}/${file}`)));
}

export default ui;
