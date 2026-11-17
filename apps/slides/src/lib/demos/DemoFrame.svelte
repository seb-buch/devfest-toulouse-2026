<script lang="ts">
	import type { Snippet } from 'svelte';
	import './demo.css';

	/*  Fenêtre d'application qui encadre une démo  */
	type Props = {
		title?: string;
		children: Snippet;
	};

	const { title, children }: Props = $props();
</script>

<div class="demo-window">
	<div class="demo-titlebar">
		<span class="demo-lights"><span></span><span></span><span></span></span>
		{title}
	</div>
	<div class="demo-body">
		{@render children()}
	</div>
</div>
