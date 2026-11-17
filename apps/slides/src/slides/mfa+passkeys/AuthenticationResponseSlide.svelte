<script lang="ts">
	import { Code, Slide, SpeakerNotes } from '@seb-buch/slyd';
	import CeremonyTitle from '#lib/components/ceremony/CeremonyTitle.svelte';
	import CeremonyCodeLayout from '#lib/components/code/CeremonyCodeLayout.svelte';
	import CodePanel from '#lib/components/code/CodePanel.svelte';
	import { codeView, objectLines } from '#lib/components/code/code-view.ts';
	import type { AuthenticationCredential, Exchange } from '#lib/demos/ceremony-data.ts';
	import DecodedPopups from './DecodedPopups.svelte';

	type Props = { exchange: Exchange<unknown, AuthenticationCredential> };
	const { exchange }: Props = $props();

	/*  Objet réel, encodé ; seuls les champs décrits sont surlignés  */
	const view = $derived(codeView(objectLines(exchange.credential)));
	const CODE_STEPS = [
		['id', 'rawId'],
		['response.authenticatorData'],
		['response.clientDataJSON'],
		['response.signature'],
		['response.userHandle']
	];

	/*  Après le parcours du code : les champs encodés, décodés un par un dans une pop-up  */
	const POPUP_STEPS = [['response.clientDataJSON'], ['response.authenticatorData']];

	/*  Étape courante : nombre d'étapes de surlignage révélées  */
	let step = $state(0);
	const popup = $derived(step - CODE_STEPS.length);

	function trackSteps(container: HTMLElement) {
		const recount = () => (step = container.querySelectorAll('.slyd-code__step.revealed').length);
		const observer = new MutationObserver(recount);
		observer.observe(container, { subtree: true, attributes: true, attributeFilter: ['class'] });
		return () => observer.disconnect();
	}
</script>

<Slide>
	<CeremonyTitle api="verify-authentication" title="La réponse de connexion renvoyée" />

	<CeremonyCodeLayout highlight={[4, 5]} kind="authentication">
		<div {@attach trackSteps} class="stage">
			<CodePanel live={exchange.live} title="credential.toJSON()">
				{#key view.code}
					<Code
						lang="ts"
						theme="github-light-high-contrast"
						highlightedLines={view.highlightSteps(...CODE_STEPS, ...POPUP_STEPS)}>{view.code}</Code
					>
				{/key}
			</CodePanel>

			<DecodedPopups response={exchange.credential.response} shown={popup} />
		</div>
	</CeremonyCodeLayout>

	<SpeakerNotes>
		Alors justement cette réponse renvoyée au serveur à quoi elle ressemble, c'est un objet JSON
		avec comme tout à l'heure l'identifiant, vous voyez d'ailleurs que c'est le même identifiant que
		la clé qu'on avait enregistrée tout à l'heure si vous êtes vraiment assidu. On va avoir Comme
		tout à l'heure, un objet encodé qui va être lié aux données de l'authentificateur, un objet
		encodé qui va être lié aux données client, la signature associée au challenge, c'est ce qui va
		permettre après au serveur de vérifier que la clé a bien servi pour ce challenge, pour signer le
		challenge, et le user handle. de l'utilisateur. Le client data il ressemble à quoi ? Il a une
		allure assez similaire à ce qu'on a vu tout à l'heure, sauf que cette fois-ci, le type d'action
		qui a été faite, c'est une récupération, donc un get, avec un challenge, l'origine de la demande
		et du site. Côté authentificateur, c'est plus simple que tout à l'heure, puisqu'on va avoir
		juste un Hash associé au RPID, et puis les flags. Donc là, vous voyez que les flags qui sont en
		montée, c'est utilisateur présent, la clé est sauvegardable et elle a été sauvegardée.
	</SpeakerNotes>
</Slide>

<style>
	.stage {
		position: relative;
	}
</style>
