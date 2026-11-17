<script lang="ts">
	import CeremonyBadge, { type CeremonyKind } from './CeremonyBadge.svelte';

	type Props = {
		/** Cérémonie, pour son symbole ; inutile si une miniature l'affiche déjà */
		kind?: CeremonyKind;
		/** Nom de la cérémonie */
		title: string;
		/** Appel de l'API navigateur qui la déclenche */
		api: string;
	};

	const { kind, title, api }: Props = $props();
</script>

<!--  Titre de cérémonie : son symbole, le nom et l'appel d'API sur la même ligne  -->
<h3>
	{#if kind}
		<CeremonyBadge {kind} size={56} />
	{/if}
	{title}
	<span aria-hidden="true" class="separator">·</span>
	<code>{api}</code>
</h3>

<style>
	h3 {
		display: flex;
		align-items: center;
		gap: 0.4em;
	}

	.separator {
		font-size: 1.4em;
		line-height: 1;
		font-family: var(--slyd-main-font), sans-serif;
		color: var(--sunset-orange);
	}

	/*  L'appel d'API : c'est du code, pas la suite du titre  */
	code {
		font-size: 0.6em;
		font-weight: 400;
		text-transform: none;
		color: var(--slyd-main-color);
	}
</style>
