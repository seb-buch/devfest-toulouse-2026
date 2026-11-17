import path from 'node:path';
import { defineConfig, includeIgnoreFile } from 'eslint/config';
import svelte from 'eslint-plugin-svelte';
import ts from 'typescript-eslint';
import common from '../../eslint.config.js';

export default defineConfig(
	common,
	includeIgnoreFile(path.resolve(import.meta.dirname, '.gitignore'), {
		gitignoreResolution: true
	}),
	svelte.configs.recommended,
	svelte.configs.prettier,
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser
			}
		},
		rules: {
			// typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
			// see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
			'svelte/no-at-html-tags': 'off'
		}
	},
	{
		// Extraits de code des slides (chargés en ?raw) : affichés, jamais exécutés
		files: ['src/slides/**/code/**'],
		rules: {
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/ban-ts-comment': 'off'
		}
	}
);
