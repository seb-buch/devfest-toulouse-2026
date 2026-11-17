<script lang="ts">
	import { Code, Slide, SpeakerNotes } from '@seb-buch/slyd';
	import CeremonyTitle from '#lib/components/ceremony/CeremonyTitle.svelte';
	import CeremonyCodeLayout from '#lib/components/code/CeremonyCodeLayout.svelte';
	import CodePanel from '#lib/components/code/CodePanel.svelte';
	import { snippet } from '#lib/components/code/code-view.ts';
	import loginOptions from './code/login-options.ts?raw';
</script>

<Slide>
	<CeremonyTitle api="generateAuthenticationOptions()" title="Côté serveur" />

	<CeremonyCodeLayout highlight={[1]} kind="authentication">
		<CodePanel lang="ts">
			<Code highlightedLines="|1,4|5|6|7|10" lang="ts" theme="github-light-high-contrast"
				>{snippet(loginOptions)}</Code
			>
		</CodePanel>
	</CeremonyCodeLayout>

	<SpeakerNotes>
		Alors ça a l'air marchi comme ça, on va rentrer un peu plus dans les détails. On va commencer
		comme tout à l'heure par la génération des options côté serveur. Cette fois-ci, ce n'est pas des
		options d'enregistrement, c'est des options d'authentification. C'est un peu plus simple. On va
		avoir comme tout à l'heure une bibliothèque qui va nous mettre à disposition une fonction.
		Qu'est-ce qu'on a besoin pour générer ces options d'authentification ? On a toujours besoin du
		RPID, celui-là c'est impératif. On va passer l'option AllowCredentials avec une liste vide,
		c'est les recommandations. En fait, on ne va pas demander au navigateur de nous afficher
		uniquement certaines clés d'accès, on va lui permettre de découvrir toutes les clés d'accès. Et
		on va préférer la vérification utilisateur sans l'imposer. Comme tout à l'heure, Les options
		sont générées avec un challenge et puis on va enregistrer le challenge pour vérifier la réponse
		du navigateur plus tard.
	</SpeakerNotes>
</Slide>
