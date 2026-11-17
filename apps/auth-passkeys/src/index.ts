import { Hono } from 'hono';
import { config } from './config';
import api from './api';
import ui from './ui';

const app = new Hono();

// Related Origin Requests: the browser fetches this file on the RP ID domain (WebAuthn §5.11).
app.get('/.well-known/webauthn', (c) => c.json({ origins: config.relatedOrigins }));

app.get('/ui', (c) => c.redirect('ui/', 308));
app.route('/ui/', ui);
app.route('/api', api);

export default {
	port: config.port,
	fetch: app.fetch
};
