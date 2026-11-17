<script lang="ts">
	import SectionLoadingSlide from '#lib/components/SectionLoadingSlide.svelte';
	import SectionTitleSlide from '#lib/components/SectionTitleSlide.svelte';
	import background from '#lib/assets/slides/loading/mission-4/bg.webp';
	import foreground from '#lib/assets/slides/loading/mission-4/fg.webp';
</script>

<SectionLoadingSlide {background} {foreground} />
<SectionTitleSlide {background} {foreground} mission="mission-4">
	<p>
		On repart de zéro : une nouvelle app, sans mot de passe, sans TOTP. Le compte naît avec sa
		passkey, et n'aura jamais d'autre moyen de connexion.
	</p>
</SectionTitleSlide>
