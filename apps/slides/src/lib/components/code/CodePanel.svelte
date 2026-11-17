<script lang="ts">
	import type { Snippet } from 'svelte';

	const LANG_NAMES = { ts: 'TypeScript', js: 'JavaScript' };

	type Props = {
		/** Légende au-dessus du code (fichier, appel d'API…) */
		title?: string;
		/** Langage du code, affiché par son logo en haut à droite du cadre */
		lang?: keyof typeof LANG_NAMES;
		/** Données affichées : true issues de la démo, false exemple ; absent : code statique */
		live?: boolean;
		children: Snippet;
	};

	const { title, lang, live, children }: Props = $props();
</script>

<!--  Cadre blanc à ombre portée, comme les cartouches des acteurs  -->
<section class={['panel', { 'with-logo': lang }]}>
	{#if lang}<span class={['lang-logo', lang]} title={LANG_NAMES[lang]}>{lang.toUpperCase()}</span
		>{/if}
	{#if title !== undefined || live !== undefined}
		<header>
			{#if title !== undefined}<code>{title}</code>{/if}
			{#if live !== undefined}
				<span class={['badge', { live }]}>{live ? '● live' : 'exemple'}</span>
			{/if}
		</header>
	{/if}
	{@render children()}
</section>

<style>
	.panel {
		position: relative;
		padding: 12px 20px;
		border: 6px solid var(--night-silhouette);
		box-shadow: 10px 12px 0 var(--night-silhouette);
		background: #fff;
		font-size: 28px;

		/*  Place réservée au logo du langage, que le code ne doit pas recouvrir  */
		&.with-logo {
			padding-right: 64px;
		}

		/*  Code aligné à gauche dans le cadre (Slyd le centre)  */
		:global(.slyd-code) {
			margin: 0;
		}
	}

	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		margin-bottom: 8px;
		font-size: 26px;
		font-weight: 600;
		color: var(--slyd-headings-color);
	}

	/*  Logo du langage : carré coloré, initiales en bas à droite  */
	.lang-logo {
		position: absolute;
		z-index: 1;
		top: 12px;
		right: 12px;
		display: flex;
		align-items: flex-end;
		justify-content: flex-end;
		width: 40px;
		height: 40px;
		padding: 0 3px 1px 0;
		box-sizing: border-box;
		background: #3178c6;
		font-family: var(--slyd-main-font), sans-serif;
		font-size: 20px;
		font-weight: 700;
		line-height: 1;
		color: #fff;

		&.js {
			background: #f7df1e;
			color: #000;
		}
	}

	.badge {
		padding: 2px 14px;
		border: 3px solid var(--night-silhouette);
		background: var(--slyd-slide-bg-color);
		font-size: 20px;
		font-weight: 600;
		color: var(--slyd-main-color);
		text-transform: uppercase;

		&.live {
			background: var(--sunset-pink);
			color: #fff;
		}
	}
</style>
