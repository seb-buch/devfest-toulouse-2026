import path from 'node:path';
import { defineConfig, includeIgnoreFile } from 'eslint/config';
import common from '../../eslint.config.js';

export default defineConfig(
	common,
	includeIgnoreFile(path.resolve(import.meta.dirname, '.gitignore'), {
		gitignoreResolution: true
	})
);
