<script lang="ts">
	import { Code, Slide, SpeakerNotes } from '@seb-buch/slyd';
	import CeremonyTitle from '#lib/components/ceremony/CeremonyTitle.svelte';
	import CeremonyCodeLayout from '#lib/components/code/CeremonyCodeLayout.svelte';
	import CodePanel from '#lib/components/code/CodePanel.svelte';
	import { snippet } from '#lib/components/code/code-view.ts';
	import addPasskey from './code/add-passkey.ts?raw';
</script>

<Slide>
	<CeremonyTitle api="navigator.credentials.create()" title="Côté navigateur" />

	<CeremonyCodeLayout highlight={[1, 2, 4]} kind="registration">
		<CodePanel lang="js">
			<Code highlightedLines="|2|4-6|5|8-10" lang="js" theme="github-light-high-contrast"
				>{snippet(addPasskey)}</Code
			>
		</CodePanel>
	</CeremonyCodeLayout>

	<SpeakerNotes>
		On passe maintenant à ce qui se passe côté navigateur. Le navigateur va recevoir ces options et
		là, le navigateur a une API dédiée, native, spécifiée par W3C, qui permet de traiter ces
		options. Donc il va récupérer ces options comme je disais. On a une API qui va permettre de les
		parser. pour avoir directement l'objet qu'on va pouvoir passer à l'API dont je parlais tout à
		l'heure, Navigator Credentials Create, pour faire la communication avec l'authentificateur. Et
		le credential qu'on va récupérer de l'authentificateur, il y a également une API qui est mise en
		place pour le sérialiser et pour l'envoyer directement au serveur après derrière.
	</SpeakerNotes>
</Slide>
