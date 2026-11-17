<script lang="ts">
	import SectionLoadingSlide from '#lib/components/SectionLoadingSlide.svelte';
	import SectionTitleSlide from '#lib/components/SectionTitleSlide.svelte';
	import background from '#lib/assets/slides/loading/mission-3/bg.webp';
	import foreground from '#lib/assets/slides/loading/mission-3/fg.webp';
</script>

<SectionLoadingSlide {background} {foreground} />
<SectionTitleSlide {background} {foreground} mission="mission-3">
	Dans cette troisième mission, on va passer de la théorie à la pratique et on va implémenter ce
	qu'on a vu dans la mission précédente dans notre application.
</SectionTitleSlide>
