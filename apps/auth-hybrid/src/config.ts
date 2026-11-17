import { resolve } from 'node:path';

const port = 3001;

export const config = {
	port,
	basePath: '/api',
	appName: 'Hybrid Auth Demo',
	rpId: process.env.RP_ID ?? 'localhost',
	expectedOrigin: process.env.EXPECTED_ORIGIN ?? `http://localhost:${port}`,
	dbPath: resolve(import.meta.dir, '../data/demo.sqlite'),
	cookiePath: '/hybrid'
};
