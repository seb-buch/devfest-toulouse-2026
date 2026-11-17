<script lang="ts">
	import MissionPassedSlide, { type Objective } from '#lib/components/MissionPassedSlide.svelte';
	import background from '#lib/assets/slides/loading/mission-4/bg.webp';

	const objectives: Objective[] = [
		{
			label: 'Plus aucun secret partagé',
			detail: 'rien à hameçonner, rien à casser',
			status: 'passed'
		},
		{
			label: 'Plusieurs passkeys',
			detail: 'synchronisées, téléphone, clé',
			status: 'passed'
		},
		{
			label: 'La récupération',
			detail: 'nouvelle porte à protéger',
			status: 'warning'
		},
		{
			label: 'Plusieurs domaines',
			detail: 'un RP ID, plusieurs sites',
			status: 'passed',
			bonus: true
		}
	];
</script>

<MissionPassedSlide {background} {objectives} mission="mission-4">
	<p>
		[Secret partagé.] Cette fois, il n'y a plus de mot de passe ni de TOTP derrière. La base ne
		contient que des clés publiques, et la connexion résiste au phishing sur tout le parcours.
	</p>
	<p>
		[Plusieurs passkeys.] La contrepartie, c'est la disponibilité : il faut pouvoir ajouter,
		supprimer, utiliser son téléphone. Le site doit rendre ça simple.
	</p>
	<p>
		[Récupération.] Le maillon faible s'est déplacé vers la récupération : elle doit être aussi
		soignée que la connexion. Et le domaine, lui, devient un engagement à long terme.
	</p>
	<p>
		[Bonus.] Et en prime, nos passkeys marchent sur un autre domaine, sans rien changer côté
		utilisateur.
	</p>
</MissionPassedSlide>
