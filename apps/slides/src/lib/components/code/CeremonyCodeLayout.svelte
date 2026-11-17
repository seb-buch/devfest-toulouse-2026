<script lang="ts">
	import type { Snippet } from 'svelte';
	import MiniCeremony from '#lib/components/options/MiniCeremony.svelte';

	type Props = {
		kind: 'registration' | 'authentication';
		/** Étapes de la cérémonie couvertes par le code affiché */
		highlight: number[];
		labels?: Partial<Record<number, string>>;
		children: Snippet;
	};

	const { kind, highlight, labels, children }: Props = $props();
</script>

<!--  Le code, et à côté l'étape de la cérémonie (section précédente) qu'il implémente  -->
<div class="layout">
	<MiniCeremony {kind} {highlight} {labels} />
	<div class="code">
		{@render children()}
	</div>
</div>

<style>
	.layout {
		display: flex;
		align-items: center;
		gap: 48px;
		min-height: 820px;
	}

	.code {
		display: flex;
		flex-direction: column;
		gap: 28px;
		flex: 1;
		min-width: 0;
	}
</style>
