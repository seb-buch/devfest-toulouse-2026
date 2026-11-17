<script lang="ts">
	import MissionPassedSlide, { type Objective } from '#lib/components/MissionPassedSlide.svelte';
	import background from '#lib/assets/slides/loading/mission-2/bg.webp';
	import { SpeakerNotes } from '@seb-buch/slyd';

	const objectives: Objective[] = [
		{
			label: 'Prouver sans montrer',
			detail: "la clé privée ne quitte jamais l'appareil",
			status: 'passed'
		},
		{
			label: 'Anti-phishing par construction',
			detail: 'le navigateur vérifie RP ID ↔ origine',
			status: 'passed'
		},
		{
			label: 'Sans identifiant',
			detail: "passkey découvrable, l'authentificateur propose",
			status: 'passed'
		},
		{ label: 'Pas encore en prod', detail: 'des options, pas encore de code', status: 'failed' }
	];
</script>

<MissionPassedSlide
	{background}
	hint="Et si on branchait ça sur notre app ?"
	mission="mission-2"
	{objectives}
>
	<p>
		[Prouver sans montrer.] On ne montre plus un secret, on signe un challenge. La clé privée reste
		dans l'authentificateur ; le serveur ne garde que la clé publique.
	</p>
	<p>
		[Anti-phishing.] Le RP ID est vérifié par le navigateur face à l'origine de la page : sur un
		faux site, la passkey ne sort tout simplement pas.
	</p>
	<p>
		[Sans identifiant.] Avec une passkey découvrable, plus besoin de taper son identifiant :
		l'authentificateur propose les passkeys du site et renvoie le user handle.
	</p>
	<p>
		[Pas encore en prod.] On a toutes les options en main, mais rien n'est encore branché. Ce que le
		serveur génère vraiment, on le verra en direct.
	</p>
	<p>[Astuce.] Prochaine mission : ajouter une passkey à notre app avec mot de passe et TOTP.</p>
	<SpeakerNotes>
		Voilà, on a fait le tour. Donc qu'est-ce qu'on a vu en fait ? On a vu qu'on pouvait prouver son
		identité et être authentifié sans qu'il n'y ait aucun échange de secret. La clé privée, elle est
		stockée au niveau de l'authentificateur. Elle n'est jamais sortie de cet authentificateur. Par
		construction, une clé est associée à un site. résistant au phishing par construction. On peut se
		connecter sans s'identifiant au préalable par défaut, c'est les recommandations W3C, c'est pour
		ça qu'on parle de clé d'accès découvrable. Et par contre, on a vu les options, on a vu un peu la
		théorie, mais on n'a toujours pas vu en pratique comment on pouvait faire. Donc on va y aller,
		on va brancher tout ça sur notre application.
	</SpeakerNotes>
</MissionPassedSlide>
