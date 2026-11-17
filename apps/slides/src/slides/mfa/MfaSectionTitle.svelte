<script lang="ts">
	import SectionLoadingSlide from '#lib/components/SectionLoadingSlide.svelte';
	import SectionTitleSlide from '#lib/components/SectionTitleSlide.svelte';
	import background from '#lib/assets/slides/loading/mission-1/bg.webp';
	import foreground from '#lib/assets/slides/loading/mission-1/fg.webp';
</script>

<SectionLoadingSlide {background} {foreground}>
	Ah bah oui, c'est vrai, c'est un GTA, il n'y a pas de GTA sans écran de chargement. Désolé... OK,
	on est bon c'est bien chargé!
</SectionLoadingSlide>
<SectionTitleSlide {background} {foreground} mission="mission-1">
	Alors dans cette mission, on va regarder ce qu'on connaît tous, à savoir l'application de type
	MFA, où on va voir l'authentification par mot de passe et associer à un deuxième facteur
	d'authentification qui passe par un code à usage unique.
</SectionTitleSlide>
