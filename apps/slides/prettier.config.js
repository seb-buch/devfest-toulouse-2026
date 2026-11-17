import common from '../../prettier.config.js';
import * as svelte from 'prettier-plugin-svelte';

/** @type {import('prettier').Config} */
export default {
	...common,
	plugins: [svelte],
	overrides: [
		{ files: '*.svelte', options: { parser: 'svelte' } },
		{
			/*  Extraits de code affichés dans les slides : largeur limitée par le cadre de code  */
			files: 'src/slides/**/code/*.ts',
			options: { printWidth: 76 }
		}
	]
};
