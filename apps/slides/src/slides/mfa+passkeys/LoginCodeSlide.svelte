<script lang="ts">
	import { Code, Slide, SpeakerNotes } from '@seb-buch/slyd';
	import CeremonyTitle from '#lib/components/ceremony/CeremonyTitle.svelte';
	import CeremonyCodeLayout from '#lib/components/code/CeremonyCodeLayout.svelte';
	import CodePanel from '#lib/components/code/CodePanel.svelte';
	import { snippet } from '#lib/components/code/code-view.ts';
	import loginWithPasskey from './code/login-with-passkey.ts?raw';
	import loginInput from './code/login-input.html?raw';
</script>

<Slide>
	<CeremonyTitle api="navigator.credentials.get()" title="Conditional UI" />

	<CeremonyCodeLayout highlight={[1, 2, 4]} kind="authentication">
		<CodePanel>
			<Code lang="html" showLineNumbers={false} theme="github-light-high-contrast"
				>{snippet(loginInput)}</Code
			>
		</CodePanel>
		<CodePanel lang="js">
			<Code highlightedLines="|2-3|5|7-11|9|13-15" lang="js" theme="github-light-high-contrast"
				>{snippet(loginWithPasskey)}</Code
			>
		</CodePanel>
	</CeremonyCodeLayout>

	<SpeakerNotes>
		On passe côté navigateur, qu'est-ce qui se passe ? Alors première chose, vous voyez qu'il y a du
		HTML et du JavaScript. Dans le HTML, au niveau de l'input utilisé pour le login, on a une option
		autocomplete et on va mettre username et webauthn. Et c'est ça qui va permettre au navigateur
		quand on clique sur l'input pour rentrer notre login d'enclencher le processus pour faire la
		découverte des clés à disposition. Donc ça c'est pour le côté HTML. Côté JavaScript, ça va se
		passer de manière très similaire à ce qu'on a vu tout à l'heure. Mais vous allez voir qu'il va y
		avoir une petite subtilité. La première, c'est la première ligne où on va d'abord vérifier que
		le navigateur permet d'avoir accès au credential. Donc ça c'est la première ligne. Si il n'y a
		pas accès, la découverte tombe à l'eau. Donc on la laisse tomber. Et puis ensuite, on a la
		l'obtention des options d'authentification, c'est ce qu'on a vu à l'étape précédente côté
		serveur. Et on va ensuite demander à l'authentificateur via l'API mise à disposition par le
		navigateur. Merci W3C pour les spécifications. Cette API va nous permettre de mettre à
		disposition les options qu'on a récupérées. et d'enclencher la découverte et l'affichage des
		credentials. Donc ça c'est la médiation conditionnal. Et pour ce qui est du signal, c'est un
		harboard signal, donc on ne va pas rentrer dans les détails, mais c'est lié à le fait d'annuler
		la requête. Une fois qu'on a la réponse faite par l'authentificateur, on va se contenter de la
		sérialiser puis la renvoyer au serveur.
	</SpeakerNotes>
</Slide>
