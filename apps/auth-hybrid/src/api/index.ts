import { Hono } from 'hono';
import { auth } from './auth';

const api = new Hono();

api.get('/', (c) => {
	return c.json({ message: 'Hello from auth-hybrid!' });
});

api.on(['GET', 'POST'], '/*', (c) => auth.handler(c.req.raw));

export default api;
