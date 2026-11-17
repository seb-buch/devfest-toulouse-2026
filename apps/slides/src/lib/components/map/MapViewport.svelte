<script lang="ts">
	import type { Snippet } from 'svelte';

	const MAP_WIDTH = 1920;
	const MAP_HEIGHT = 1080;

	let { children }: { children: Snippet } = $props();

	let availableWidth = $state(0);
	let availableHeight = $state(0);
	const scale = $derived(Math.min(availableWidth / MAP_WIDTH, availableHeight / MAP_HEIGHT));
</script>

<div class="viewport" bind:clientWidth={availableWidth} bind:clientHeight={availableHeight}>
	<div class="frame" style:width="{MAP_WIDTH * scale}px" style:height="{MAP_HEIGHT * scale}px">
		<div class="content" style:scale>
			{@render children()}
		</div>
	</div>
</div>

<style>
	.viewport {
		width: 100%;
		height: 100%;
		display: grid;
		place-items: center;
		overflow: hidden;
	}

	.frame {
		position: relative;
	}

	.content {
		position: absolute;
		top: 0;
		left: 0;
		width: 1920px;
		height: 1080px;
		transform-origin: top left;
	}
</style>
