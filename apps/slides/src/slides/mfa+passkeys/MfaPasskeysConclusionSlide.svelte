<script lang="ts">
	import MissionPassedSlide, { type Objective } from '#lib/components/MissionPassedSlide.svelte';
	import background from '#lib/assets/slides/loading/mission-3/bg.webp';

	const objectives: Objective[] = [
		{
			label: 'Liée au site',
			detail: 'la connexion par passkey résiste au phishing',
			status: 'passed'
		},
		{
			label: 'Une clé publique en base',
			detail: 'pas de clé privée à voler',
			status: 'passed'
		},
		{
			label: 'Les autres accès restent',
			detail: 'mot de passe, TOTP, récupération',
			status: 'failed'
		}
	];
</script>

<MissionPassedSlide
	{background}
	hint="Et si on retirait le mot de passe ?"
	mission="mission-3"
	{objectives}
>
	Et voilà, on a accompli notre mission. On a une connexion qui se fait par des clés et qui est liée
	au site. On a une connexion maintenant qui est résistante au phishing. La seule chose qui a été
	échangée, vous l'avez vu dans les échanges, c'est la clé publique. La clé privée, elle, elle est
	stockée dans l'authentificateur et elle n'est pas du tout à la disposition du serveur et pas du
	tout échangée. En revanche, les autres accès et il reste présent. Donc on a le mot de passe LTOTP
	qui sont des méthodes d'authentification qui sont toujours utilisables. Donc c'est pas génial. On
	peut essayer d'aller plus loin et se dire est-ce qu'on ne peut pas retirer complètement le mot de
	passe de notre application ?
</MissionPassedSlide>
