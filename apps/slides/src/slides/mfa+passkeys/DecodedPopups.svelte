<script lang="ts">
	import { Code } from '@seb-buch/slyd';
	import CodePanel from '#lib/components/code/CodePanel.svelte';
	import { codeView, objectLines } from '#lib/components/code/code-view.ts';
	import { decodeAuthenticatorData, decodeClientData } from '#lib/demos/webauthn-decoding.ts';
	import FlagsLegend from './FlagsLegend.svelte';

	/*
	 * Champs encodés d'une réponse WebAuthn, décodés dans une pop-up centrée sur le code.
	 * Le parent doit être positionné (position: relative).
	 */
	type Props = {
		response: { clientDataJSON: string; authenticatorData: string };
		/** Pop-up affichée : 1 clientDataJSON, 2 authenticatorData, autre valeur aucune */
		shown: number;
	};
	const { response, shown }: Props = $props();

	const clientData = $derived(JSON.stringify(decodeClientData(response.clientDataJSON), null, 2));
	const authenticatorData = $derived(
		codeView(objectLines(decodeAuthenticatorData(response.authenticatorData), 36)).code
	);
</script>

<div class={['popup', { shown: shown === 1 }]}>
	<CodePanel title="clientDataJSON décodé">
		{#key clientData}
			<Code lang="json" theme="github-light-high-contrast">{clientData}</Code>
		{/key}
	</CodePanel>
</div>

<div class={['popup', { shown: shown === 2 }]}>
	<CodePanel title="authenticatorData décodé">
		{#key authenticatorData}
			<Code lang="ts" theme="github-light-high-contrast">{authenticatorData}</Code>
		{/key}
		<FlagsLegend />
	</CodePanel>
</div>

<style>
	.popup {
		position: absolute;
		top: 50%;
		left: 50%;
		translate: -50% -50%;
		width: max-content;
		max-width: 100%;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.3s;

		&.shown {
			opacity: 1;
		}
	}
</style>
