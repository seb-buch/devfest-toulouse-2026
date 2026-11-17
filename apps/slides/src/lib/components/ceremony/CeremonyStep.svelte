<script lang="ts">
	import type { Snippet } from 'svelte';

	type Actor = 'authenticator' | 'browser' | 'server';

	type Props = {
		number: number;
		/** Ordre d'apparition ; absent : l'étape est visible d'emblée (miniatures) */
		fragmentIndex?: number;
		/** Acteur qui agit ou qui envoie */
		from: Actor;
		/** Destinataire du message ; absent pour une action interne à l'acteur */
		to?: Actor;
		/** Position de la carte d'un message : sous l'émetteur (défaut) ou entre les deux acteurs */
		cardAt?: 'sender' | 'between';
		/** Étape estompée, pour mettre en avant les autres */
		dimmed?: boolean;
		children: Snippet;
	};

	const {
		number,
		fragmentIndex,
		from,
		to,
		cardAt = 'sender',
		dimmed = false,
		children
	}: Props = $props();

	/*
	 * Grille de 6 colonnes : l'acteur n occupe les colonnes 2n-1 et 2n, son axe est la ligne 2n.
	 * Un message va d'un axe à l'autre ; sa carte est sous l'émetteur, ou entre les deux acteurs
	 * si elle est trop large. Une action interne couvre la colonne de l'acteur.
	 */
	const position: Record<Actor, number> = { authenticator: 1, browser: 2, server: 3 };

	const senderColumns = $derived(`${2 * position[from] - 1} / span 2`);

	const arrowColumns = $derived.by(() => {
		if (to === undefined) {
			return undefined;
		}
		const [start, end] = [position[from], position[to]].sort((a, b) => a - b);
		return `${2 * start} / ${2 * end}`;
	});

	const cardColumns = $derived(
		arrowColumns !== undefined && cardAt === 'between' ? arrowColumns : senderColumns
	);

	const towardsLeft = $derived(to !== undefined && position[to] < position[from]);

	const isFragment = $derived(fragmentIndex !== undefined);
</script>

<div
	class={[
		'row',
		{ 'fragment custom': isFragment, revealed: !isFragment, 'towards-left': towardsLeft, dimmed }
	]}
	data-fragment-index={fragmentIndex}
>
	<div class="card" style:grid-column={cardColumns}>
		<span class="number">{number}</span>
		<div class="content">{@render children()}</div>
	</div>
	{#if arrowColumns !== undefined}
		<div class="arrow" style:grid-column={arrowColumns} aria-hidden="true">
			<span class="line"></span>
			<svg class="head" viewBox="0 0 24 40">
				<path d="M 4 4 L 20 20 L 4 36" />
			</svg>
		</div>
	{/if}
</div>

<style>
	/*  Carte sur la première ligne de la grille, flèche sur la seconde  */
	.row {
		display: grid;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		row-gap: 8px;
	}

	.dimmed {
		opacity: 0.3;
		filter: grayscale(1);
	}

	/*  Carte : « poppe » à la révélation  */
	.card {
		grid-row: 1;
		justify-self: center;
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 6px 22px 6px 8px;
		border: 5px solid var(--night-silhouette);
		box-shadow: 8px 10px 0 var(--night-silhouette);
		background: #fff;
		font-size: 26px;
		line-height: 1.25;
		white-space: nowrap;
		opacity: 0;
		scale: 0.6;
		transition:
			opacity 0.2s ease,
			scale 0.35s cubic-bezier(0.2, 1.6, 0.4, 1);
	}

	.number {
		display: grid;
		place-items: center;
		flex-shrink: 0;
		width: 50px;
		height: 50px;
		border: 4px solid var(--night-silhouette);
		border-radius: 50%;
		background: var(--sunset-yellow);
		font-size: 36px;
		font-weight: bold;
	}

	.content {
		display: flex;
		flex-direction: column;
	}

	/*  Flèche GPS : la ligne se trace depuis l'émetteur, puis la pointe apparaît  */
	.arrow {
		grid-row: 2;
		display: flex;
		align-items: center;
	}

	.towards-left .arrow {
		flex-direction: row-reverse;

		.head {
			scale: -1 1;
		}
	}

	.line {
		flex: 1;
		height: 10px;
		margin-right: -14px;
		border-radius: 5px;
		background: var(--sunset-pink);
		transform-origin: left;
		scale: 0 1;
		transition: scale 0.5s ease-in-out 0.2s;
	}

	.towards-left .line {
		margin: 0 0 0 -14px;
		transform-origin: right;
	}

	.head {
		width: 24px;
		height: 40px;
		opacity: 0;
		transition: opacity 0.1s linear 0.7s;

		path {
			fill: none;
			stroke: var(--sunset-pink);
			stroke-width: 9;
			stroke-linecap: round;
			stroke-linejoin: round;
		}
	}

	.row:global(.revealed) {
		.card {
			opacity: 1;
			scale: 1;
		}

		.line {
			scale: 1 1;
		}

		.head {
			opacity: 1;
		}
	}
</style>
