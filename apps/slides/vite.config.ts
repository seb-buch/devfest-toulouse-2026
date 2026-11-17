import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			adapter: adapter(),

			paths: {
				// Set to `/<repo>` when building for GitHub Pages, empty when served at the domain root.
				base: (process.env.BASE_PATH ?? '') as '' | `/${string}`
			}
		})
	],
	server: {
		host: '127.0.0.1',
		allowedHosts: ['gta-passkeys-city.demo']
	}
});
