<script lang="ts">
	import { Code, Slide, SpeakerNotes } from '@seb-buch/slyd';
	import CeremonyTitle from '#lib/components/ceremony/CeremonyTitle.svelte';
	import CeremonyCodeLayout from '#lib/components/code/CeremonyCodeLayout.svelte';
	import CodePanel from '#lib/components/code/CodePanel.svelte';
	import { snippet } from '#lib/components/code/code-view.ts';
	import passkeyOptions from './code/passkey-options.ts?raw';
</script>

<Slide>
	<CeremonyTitle api="generateRegistrationOptions()" title="Côté serveur" />

	<CeremonyCodeLayout highlight={[1]} kind="registration">
		<CodePanel lang="ts">
			<Code
				highlightedLines="|1,6|7-8|9-11|4,12|13-17|20|21"
				lang="ts"
				theme="github-light-high-contrast">{snippet(passkeyOptions)}</Code
			>
		</CodePanel>
	</CeremonyCodeLayout>

	<SpeakerNotes>
		Donc qu'est-ce qui s'est passé concrètement quand j'ai fait l'enregistrement de ma clé d'accès ?
		Comme on le disait tout à l'heure en termes de théorie, il y a les options qui ont été générées
		côté serveur. Côté serveur, là j'ai mis un exemple de code en TypeScript. On va utiliser une
		bibliothèque, dans le cas ici SimpleWebAuthn, qui va mettre à disposition une fonction pour
		générer les options. Et cette option, qu'est-ce qu'elle va. Cette fonction va avoir besoin de
		quoi pour générer les options d'enregistrement ? Le RP ID, c'est-à-dire le nom de domaine, le
		nom d'affichage du RP, les informations sur l'utilisateur. Donc l'ID, vous voyez que ce n'est
		pas l'ID de l'utilisateur, c'est le WebAuthnUserID, ça correspond à le user handle qui est un
		identifiant qui n'a pas de lien avec l'identifiant utilisateur dans l'application, qui est
		simplement lié à la gestion des clés d'accès. Le nom d'utilisateur et le nom à afficher. On va
		aussi lister les credentials qui existent déjà pour cet utilisateur pour les exclure de la
		création. tout simplement, et puis on va passer à le reste des options nécessaires pour parler
		de passki, à savoir une clé découvrable de manière obligatoire, une vérification qui est
		seulement préférée, qui n'est pas imposée, et pas de demande d'attestation de l'authentificateur
		parce qu'on est dans une version grand public des clés d'accès. Cette fonction va nous générer
		les options et va aussi nous générer un challenge, un challenge qu'on va enregistrer de manière
		temporaire pour pouvoir après vérifier la réponse que le serveur nous enverra. Puis on va
		envoyer ces options.
	</SpeakerNotes>
</Slide>
