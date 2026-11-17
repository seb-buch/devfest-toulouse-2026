<script lang="ts">
	import { Code, Slide, SpeakerNotes } from '@seb-buch/slyd';
	import CeremonyTitle from '#lib/components/ceremony/CeremonyTitle.svelte';
	import CeremonyCodeLayout from '#lib/components/code/CeremonyCodeLayout.svelte';
	import CodePanel from '#lib/components/code/CodePanel.svelte';
	import { codeView, objectLines } from '#lib/components/code/code-view.ts';
	import type { AuthenticationOptions, Exchange } from '#lib/demos/ceremony-data.ts';

	type Props = { exchange: Exchange<AuthenticationOptions, unknown> };
	const { exchange }: Props = $props();

	/*  Objet réel, encodé ; seuls les champs décrits sont surlignés  */
	const view = $derived(codeView(objectLines(exchange.options)));
</script>

<Slide>
	<CeremonyTitle api="generate-authenticate-options" title="Les options de connexion générées" />

	<CeremonyCodeLayout highlight={[1]} kind="authentication">
		<CodePanel live={exchange.live} title="PublicKeyCredentialRequestOptionsJSON">
			{#key view.code}
				<Code
					lang="ts"
					theme="github-light-high-contrast"
					highlightedLines={view.highlightSteps(['rpId', 'challenge'], ['userVerification'])}
					>{view.code}</Code
				>
			{/key}
		</CodePanel>
	</CeremonyCodeLayout>

	<SpeakerNotes>
		à quoi elles ressemblent ces options générées, vous voyez que c'est très simple. On va avoir le
		RP ID, donc le nom de domaine qui va être passé, le challenge et on va avoir l'option sur la
		vérification de l'utilisateur. C'est très simple.
	</SpeakerNotes>
</Slide>
