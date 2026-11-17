<script lang="ts">
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';

	import background from '#lib/assets/slides/backgrounds/title.webp';
	import GameTitle from '#lib/components/GameTitle.svelte';
</script>

<Slide backgroundImage={background} backgroundSize="cover">
	<div class="title-page">
		<div class="title">
			<GameTitle height={380} />
		</div>
	</div>
	<SpeakerNotes>
		J'ai fait un effort et GTA! Bon, ok, désolé, je vois un petit peu la déception sur vos visages,
		c'est pas forcément ce GTA là que vous attendiez... On fait ce qu'on peut avec ce qu'on a...
	</SpeakerNotes>
</Slide>

<style>
	.title-page {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;

		.title {
			padding-left: 250px;
		}
	}
</style>
