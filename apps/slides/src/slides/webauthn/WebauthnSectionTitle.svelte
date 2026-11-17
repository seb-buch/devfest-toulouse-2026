<script lang="ts">
	import SectionLoadingSlide from '#lib/components/SectionLoadingSlide.svelte';
	import SectionTitleSlide from '#lib/components/SectionTitleSlide.svelte';
	import background from '#lib/assets/slides/loading/mission-2/bg.webp';
	import foreground from '#lib/assets/slides/loading/mission-2/fg.webp';
</script>

<SectionLoadingSlide {background} {foreground} loadingTime={2}>
	Évidemment, on a toujours ce chargement...
</SectionLoadingSlide>
<SectionTitleSlide {background} {foreground} mission="mission-2">
	Voilà. Le but de cette mission, c'est de comprendre comment est-ce qu'on va pouvoir avec une clé
	(en réalité, une paire de clé) pouvoir authentifier quelqu'un.
</SectionTitleSlide>
