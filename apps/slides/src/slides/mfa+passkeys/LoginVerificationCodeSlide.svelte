<script lang="ts">
	import { Code, Slide, SpeakerNotes } from '@seb-buch/slyd';
	import CeremonyTitle from '#lib/components/ceremony/CeremonyTitle.svelte';
	import CeremonyCodeLayout from '#lib/components/code/CeremonyCodeLayout.svelte';
	import CodePanel from '#lib/components/code/CodePanel.svelte';
	import { snippet } from '#lib/components/code/code-view.ts';
	import loginVerification from './code/login-verification.ts?raw';
</script>

<Slide>
	<CeremonyTitle api="verifyAuthenticationResponse()" title="Côté serveur" />

	<CeremonyCodeLayout highlight={[5]} kind="authentication">
		<CodePanel lang="ts">
			<Code
				highlightedLines="|4,6|7-9|1,12-19|13|14-17|22-23"
				lang="ts"
				theme="github-light-high-contrast">{snippet(loginVerification)}</Code
			>
		</CodePanel>
	</CeremonyCodeLayout>

	<SpeakerNotes>
		Et pour finir, qu'est-ce qui se passe côté serveur pour vérifier la réponse ? Donc on va en fait
		premièrement récupérer ce qu'on attend, c'est-à-dire le challenge et l'utilisateur associé à la
		passe qui passée dans la réponse. Première chose qu'on va faire, c'est qu'on va vérifier que
		l'utilisateur a un user handle qui correspond à ce que nous donne la réponse. Si ce n'est pas le
		cas, on refuse d'aller plus loin, l'authentification est refusée. Et ensuite, on va utiliser une
		fonction mise à disposition par une librairie pour vérifier la réponse renvoyée par le
		navigateur. On va évidemment fournir la réponse à la fonction, puis après on va donner ce qu'on
		attend, le challenge qu'on attend, l'origine qu'on attend, le ID du RP qu'on attend et la clé
		d'accès qu'on attend. Ça va permettre de vérifier la réponse et si tout se passe bien, on va
		récupérer des informations d'authentification qu'on va pouvoir utiliser pour mettre à jour notre
		base de données et à partir du moment où on a passé toutes ces étapes là on va pouvoir renvoyer
		l'utilisateur qui a été effectivement authentifié.
	</SpeakerNotes>
</Slide>
