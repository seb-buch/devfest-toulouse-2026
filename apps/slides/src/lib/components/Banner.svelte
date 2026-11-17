<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		fragmentIndex: number;
		children: Snippet;
	};

	const { fragmentIndex, children }: Props = $props();
</script>

<!--  Bandeau de fin de mission : la phrase à retenir, en bas de la diapo  -->
<p class="banner fragment custom" data-fragment-index={fragmentIndex}>
	{@render children()}
</p>

<style>
	.banner {
		position: absolute;
		left: 50%;
		bottom: 40px;
		margin: 0;
		padding: 6px 36px;
		translate: -50% 0;
		rotate: -1.5deg;
		border: 6px solid var(--night-silhouette);
		box-shadow: 12px 14px 0 var(--night-silhouette);
		background: var(--sunset-yellow);
		font-family: var(--slyd-headings-font), sans-serif;
		font-size: 44px;
		text-transform: uppercase;
		white-space: nowrap;
		opacity: 0;
		scale: 0.6;
		transition:
			opacity 0.2s ease,
			scale 0.35s cubic-bezier(0.2, 1.6, 0.4, 1);

		&:global(.revealed) {
			opacity: 1;
			scale: 1;
		}

		:global(em) {
			font-style: normal;
			color: var(--slyd-headings-color);
			text-decoration: underline 5px;
			text-underline-offset: 6px;
		}
	}
</style>
