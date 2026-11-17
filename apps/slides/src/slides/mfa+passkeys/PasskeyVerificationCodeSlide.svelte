<script lang="ts">
	import { Code, Slide, SpeakerNotes } from '@seb-buch/slyd';
	import CeremonyTitle from '#lib/components/ceremony/CeremonyTitle.svelte';
	import CeremonyCodeLayout from '#lib/components/code/CeremonyCodeLayout.svelte';
	import CodePanel from '#lib/components/code/CodePanel.svelte';
	import { snippet } from '#lib/components/code/code-view.ts';
	import passkeyVerification from './code/passkey-verification.ts?raw';
</script>

<Slide>
	<CeremonyTitle api="verifyRegistrationResponse()" title="Côté serveur" />

	<CeremonyCodeLayout highlight={[5]} kind="registration">
		<CodePanel lang="ts">
			<Code highlightedLines="|4|1,6-14|7|8-11|15-16" lang="ts" theme="github-light-high-contrast"
				>{snippet(passkeyVerification)}</Code
			>
		</CodePanel>
	</CeremonyCodeLayout>

	<SpeakerNotes>
		Et on en arrive à la dernière partie, à savoir la vérification côté serveur de la réponse du
		navigateur. Pour ça, comme pour la génération des options, on va passer par une bibliothèque. Et
		on va récupérer le challenge qu'on avait stocké. et qui va nous servir pour vérifier la réponse.
		Donc on va évidemment passer à la fonction de la bibliothèque notre réponse, ce qu'on attend,
		c'est-à-dire le challenge qu'on attend, qui est celui qu'on avait stocké pour vérification,
		l'origine qu'on attend, l'ID qu'on attend et le fait qu'on n'impose pas la vérification
		utilisateur. Donc ça c'est pour la version grand public. Et si tout se passe bien, on va générer
		une réponse qu'on va pouvoir stocker dans la base de données parce que tout va bien.
	</SpeakerNotes>
</Slide>
