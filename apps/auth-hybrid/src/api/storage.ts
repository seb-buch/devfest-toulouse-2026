import { Database } from 'bun:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { config } from '../config';

mkdirSync(dirname(config.dbPath), { recursive: true });
export const database = new Database(config.dbPath, { create: true });
