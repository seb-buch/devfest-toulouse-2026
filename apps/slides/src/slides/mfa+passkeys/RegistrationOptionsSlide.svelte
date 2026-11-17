<script lang="ts">
	import { Code, Slide, SpeakerNotes } from '@seb-buch/slyd';
	import CeremonyTitle from '#lib/components/ceremony/CeremonyTitle.svelte';
	import CeremonyCodeLayout from '#lib/components/code/CeremonyCodeLayout.svelte';
	import CodePanel from '#lib/components/code/CodePanel.svelte';
	import { codeView, line, list, quoted } from '#lib/components/code/code-view.ts';
	import type { Exchange, RegistrationOptions } from '#lib/demos/ceremony-data.ts';

	type Props = { exchange: Exchange<RegistrationOptions, unknown> };
	const { exchange }: Props = $props();

	const view = $derived(optionsView(exchange.options));

	function optionsView({
		challenge,
		rp,
		user,
		pubKeyCredParams,
		excludeCredentials = [],
		authenticatorSelection = {},
		attestation
	}: RegistrationOptions) {
		const algorithms = pubKeyCredParams.map(({ alg }) => alg);
		return codeView([
			line('{'),
			line(`  challenge: ${quoted(challenge)},`, 'challenge'),
			line(`  rp: { id: ${quoted(rp.id, 40)}, name: ${quoted(rp.name, 20)} },`, 'rp'),
			line('  user: {', 'user'),
			line(`    id: ${quoted(user.id)},`, 'user-id'),
			line(`    name: ${quoted(user.name, 30)},`, 'user'),
			line(`    displayName: ${quoted(user.displayName, 30)}`, 'user'),
			line('  },', 'user'),
			line(`  pubKeyCredParams: ${list(algorithms)},`, 'algorithms'),
			line(`  excludeCredentials: ${list(excludeCredentials.map(({ id }) => id))},`, 'exclude'),
			line('  authenticatorSelection: {', 'selection'),
			line(`    residentKey: ${quoted(authenticatorSelection.residentKey)},`, 'selection'),
			line(`    userVerification: ${quoted(authenticatorSelection.userVerification)}`, 'selection'),
			line('  },', 'selection'),
			line(`  attestation: ${quoted(attestation)}`, 'attestation'),
			line('}')
		]);
	}
</script>

<Slide>
	<CeremonyTitle api="generate-register-options" title="Les options d'enregistrement générées" />

	<CeremonyCodeLayout highlight={[1]} kind="registration">
		<CodePanel live={exchange.live} title="PublicKeyCredentialCreationOptionsJSON">
			{#key view.code}
				<Code
					lang="ts"
					theme="github-light-high-contrast"
					highlightedLines={view.highlightSteps(
						['challenge', 'rp'],
						['user', 'user-id'],
						['user-id'],
						['algorithms', 'exclude'],
						['selection', 'attestation']
					)}>{view.code}</Code
				>
			{/key}
		</CodePanel>
	</CeremonyCodeLayout>

	<SpeakerNotes>
		On passe ensuite aux options qui sont réellement envoyées après au navigateur. Voilà ce qui est
		concrètement envoyé au navigateur. On voit les choses les plus importantes, le challenge dont je
		parlais, qui est envoyé au navigateur, et puis les informations sur le RP, donc son identifiant
		qui correspond encore une fois au nom de domaine et le nom à afficher. On a ensuite les options
		utilisateurs avec un identifiant, un nom et un nom d'affichage. L'identifiant, comme je l'ai
		dit, c'est un identifiant qui n'est lié qu'à l'authentification, qui n'est pas lié à
		l'application. J'ai en parlé dans les options tout à l'heure, les algorithmes supportés, donc là
		vous voyez qu'on a -8, -7, -257, ce sont les identifiants des algorithmes. Et les credentials à
		exclure, et puis les options pour l'authentificateur découvrables de manière imposé,
		vérification préférée et pas d'attestation nécessaire pour l'authentificateur. Vous voyez que ça
		correspond exactement à ce qu'il y avait dans le code tout à l'heure.
	</SpeakerNotes>
</Slide>
