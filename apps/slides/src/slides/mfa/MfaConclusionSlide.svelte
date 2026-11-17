<script lang="ts">
	import MissionPassedSlide, { type Objective } from '#lib/components/MissionPassedSlide.svelte';
	import background from '#lib/assets/slides/loading/mission-1/bg.webp';

	const objectives: Objective[] = [
		{ label: 'Mot de passe volé', detail: 'ne suffit plus', status: 'passed' },
		{ label: 'Un geste en plus', detail: "ouvrir l'appli, recopier le code", status: 'failed' },
		{ label: 'Deux secrets partagés', detail: 'à protéger côté serveur', status: 'failed' },
		{
			label: 'Toujours phishable',
			link: { href: 'https://www.youtube.com/watch?v=jndhtwRME54', text: 'BreizhCamp 2026' },
			status: 'failed'
		}
	];
</script>

<MissionPassedSlide
	{background}
	hint="Et si on se connectait sans aucun secret partagé ?"
	mission="mission-1"
	{objectives}
>
	Et voilà, je ne détaille pas plus parce que ça c'est encore une fois quelque chose de très
	classique et que vous connaissez toutes et tous. On a vu qu'à partir du moment où on active
	l'authentification avec le deuxième facteur, le mot de passe volé ne suffit plus pour récupérer le
	compte. Par contre, on a un geste de plus puisqu'à chaque fois qu'on va vouloir s'authentifier, on
	va devoir ouvrir l'application et recopier un code. Concrètement, on a deux secrets qui sont
	partagés, puisqu'en plus du mot de passe stocké sous une forme hashé sur le serveur, on va avoir
	le secret partagé avec l'application d'authentification pour générer le code unique. Et enfin, je
	n'en ai pas parlé, mais même avec la deuxième authentification, on a quelque chose. qui va être
	sensible au phishing. Si jamais cela vous intéresse de comprendre pourquoi, j'ai une présentation
	à BreizhCamp cette année. La vidéo est disponible sur Youtube. Du coup, on peut se poser la
	question suivante : Et si on essayait de se connecter sans échanger aucun secret ?
</MissionPassedSlide>
