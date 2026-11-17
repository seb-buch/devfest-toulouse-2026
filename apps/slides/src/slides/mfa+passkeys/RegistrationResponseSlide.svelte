<script lang="ts">
	import { Code, Slide, SpeakerNotes } from '@seb-buch/slyd';
	import CeremonyTitle from '#lib/components/ceremony/CeremonyTitle.svelte';
	import CeremonyCodeLayout from '#lib/components/code/CeremonyCodeLayout.svelte';
	import CodePanel from '#lib/components/code/CodePanel.svelte';
	import { codeView, objectLines } from '#lib/components/code/code-view.ts';
	import type {
		Exchange,
		RegistrationCredential,
		RegistrationOptions
	} from '#lib/demos/ceremony-data.ts';
	import DecodedPopups from './DecodedPopups.svelte';

	type Props = { exchange: Exchange<RegistrationOptions, RegistrationCredential> };
	const { exchange }: Props = $props();

	/*  Objet réel, encodé ; seuls les champs décrits sont surlignés  */
	const view = $derived(codeView(objectLines(exchange.credential)));
	const CODE_STEPS = [
		['id', 'rawId'],
		['response.authenticatorData'],
		['response.clientDataJSON'],
		['response.publicKey', 'response.publicKeyAlgorithm']
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
	<CeremonyTitle api="verify-registration" title="La réponse d'enregistrement renvoyée" />

	<CeremonyCodeLayout highlight={[4, 5]} kind="registration">
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
		Et voilà, typiquement un exemple de fichier JSON qui va être renvoyé par le navigateur au
		serveur. Qu'est-ce qu'il y a dans ce fichier JSON ? On ne va pas passer tout en revue, mais on
		va se focaliser sur l'essentiel. Donc on a un identifiant pour cette clé d'accès qui a été
		créée. On va avoir des données sur l'authentificateur. On va avoir des données sur le client.
		Vous voyez que c'est des données, dans les deux cas, en fait, ce sont des objets et ces objets
		sont encodés en base64URL. On va voir après ce qu'ils contiennent. La clé publique et
		l'algorithme de chiffrement sont également présents. J'utilisais le client data JSON, c'est un
		objet et voilà, quand on le décode, on a le type. d'opération qui a été faite, donc c'est la
		création d'une clé d'accès, le challenge et l'origine de cette demande de création, ce qui va
		permettre au serveur de bien voir que le challenge et l'origine correspondent à ce qui l'attend.
		Côté authentificateur, on a aussi des données, je vais passer assez vite dessus, mais ce sont
		essentiellement des données liées à l'authentificateur et on va retrouver les flags dont je
		parlais tout à l'heure. Est-ce que l'utilisateur a été vérifié ? Est-ce que l'utilisateur était
		présent ? Est-ce que la clé est sauvegardable quelque part ? Est-ce qu'elle a été sauvegardée ?
		Et est-ce qu'on joint la clé publique à la demande de création ? Donc tout ça c'est remonté au
		serveur.
	</SpeakerNotes>
</Slide>

<style>
	.stage {
		position: relative;
	}
</style>
