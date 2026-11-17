<script lang="ts">
	import SectionLoadingSlide from '#lib/components/SectionLoadingSlide.svelte';
	import SectionTitleSlide from '#lib/components/SectionTitleSlide.svelte';
	import background from '#lib/assets/slides/loading/end/bg.webp';
	import foreground from '#lib/assets/slides/loading/end/fg.webp';
</script>

<SectionLoadingSlide {background} {foreground} />
<SectionTitleSlide {background} {foreground} mission="end">
	<p>
		Alice et Bob sont arrivés au bout de la carte : du mot de passe à une app 100 % passkeys.
		Faisons le bilan.
	</p>
</SectionTitleSlide>
