import { Hono } from 'hono';
import { config } from './config';
import api from './api';
import ui from './ui';

const app = new Hono();

app.get('/ui', (c) => c.redirect('ui/', 308));
app.route('/ui/', ui);
app.route(config.basePath, api);

export default {
	port: config.port,
	fetch: app.fetch
};
