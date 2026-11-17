<script lang="ts">
	import type { Snippet } from 'svelte';

	export type OptionValue = {
		value: string;
		label: string;
		/** Valeur retenue pour les passkeys grand public */
		chosen?: boolean;
		/** Pastille signalant une particularité de la valeur (ex. post-quantique) */
		badge?: string;
	};

	type Props = {
		/** Cérémonie ou moment où l'option intervient */
		moment?: string;
		/** Nom de l'option WebAuthn */
		name: string;
		values: OptionValue[];
		/** Effet de l'option, sous les valeurs */
		children?: Snippet;
	};

	const { moment, name, values, children }: Props = $props();

	/*  Les autres valeurs ne sont estompées que si l'une d'elles est retenue  */
	const hasChoice = $derived(values.some((value) => value.chosen));
</script>

<!--  Une option WebAuthn : son nom, ses valeurs, son effet  -->
<div class="option">
	{#if moment !== undefined}
		<p class="moment">{moment}</p>
	{/if}
	<p class="name"><code>{name}</code></p>
	<ul class="values">
		{#each values as { value, label, chosen, badge } (value)}
			<li class={{ chosen, dimmed: hasChoice && !chosen }}>
				<code>{value}</code>
				<span class="label">
					{label}
					{#if badge}
						<span class="badge">
							<!--  Atome : seul usage actuel, le post-quantique  -->
							<svg aria-hidden="true" viewBox="0 0 100 100">
								<ellipse cx="50" cy="50" rx="44" ry="16" />
								<ellipse cx="50" cy="50" rx="44" ry="16" transform="rotate(60 50 50)" />
								<ellipse cx="50" cy="50" rx="44" ry="16" transform="rotate(-60 50 50)" />
								<circle class="nucleus" cx="50" cy="50" r="8" />
							</svg>
							{badge}
						</span>
					{/if}
				</span>
			</li>
		{/each}
	</ul>
	{#if children}
		<div class="effect">{@render children()}</div>
	{/if}
</div>

<style>
	.option {
		width: 900px;
	}

	.option p {
		margin: 0;
	}

	.moment {
		font-family: var(--slyd-headings-font), sans-serif;
		font-size: 30px;
		text-transform: uppercase;
		color: var(--slyd-headings-color);
	}

	.name {
		font-size: 40px;
		font-weight: 600;
	}

	.values {
		display: grid;
		grid-template-columns: auto 1fr;
		column-gap: 20px;
		margin: 8px 0;
		padding-left: 0;
		list-style: none;
		font-size: 26px;

		li {
			display: contents;
		}

		.dimmed > * {
			opacity: 0.55;
		}

		/*  Valeur retenue pour une passkey grand public  */

		.chosen {
			font-weight: 600;
		}

		/*  Même pastille que les statuts UP / UV de userVerification  */

		/*  Libellé et pastille centrés sur la même ligne  */

		.label {
			display: flex;
			align-items: center;
			gap: 12px;
		}

		.badge {
			display: inline-flex;
			align-items: center;
			gap: 6px;
			padding: 2px 10px 2px 6px;
			border: 2px solid var(--night-silhouette);
			border-radius: 20px;
			background: var(--sunset-yellow);
			font-family: var(--slyd-headings-font), sans-serif;
			font-size: 22px;
			font-weight: normal;
			line-height: 1;
			text-transform: uppercase;
			white-space: nowrap;

			svg {
				width: 20px;
				height: 20px;
				fill: none;
				stroke: var(--night-silhouette);
				stroke-width: 7;
			}

			.nucleus {
				fill: var(--night-silhouette);
				stroke: none;
			}
		}
	}

	.effect {
		font-size: 26px;

		:global(p) {
			margin: 0 0 8px;
		}
	}
</style>
