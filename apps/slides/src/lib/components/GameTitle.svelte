<script lang="ts">
	type Props = {
		height: number;
	};
	const { height }: Props = $props();

	const WIDTH = 650;
	const HEIGHT = 335;

	const scale = $derived(height / HEIGHT);
</script>

<div class="game-title-frame" style:height="{height}px" style:width="{WIDTH * scale}px">
	<div class="game-title" style:height="{HEIGHT}px" style:scale style:width="{WIDTH}px">
		<div class="main-title stroke">
			<span class="grand">grand</span>
			<span class="truandage">truandage</span>
			<span class="authent">d'authent</span>
		</div>
		<div class="main-title fill">
			<span class="grand">grand</span>
			<span class="truandage">truandage</span>
			<span class="authent">d'authent</span>
		</div>
		<div class="edition">Passkeys&nbsp;City</div>
	</div>
</div>

<style>
	.game-title {
		position: relative;
		transform-origin: top left;

		.main-title {
			position: absolute;

			display: flex;
			flex-direction: column;
			align-items: center;
			font-family: 'Pricedown', sans-serif;
			font-weight: normal;
			text-transform: none;

			font-size: 100px;
			line-height: 1em;
			letter-spacing: 3px;

			.grand {
				margin-left: -214px;
				margin-bottom: -16px;
			}

			.authent {
				margin-right: -249px;
			}

			&.fill {
				color: white;
				z-index: 1;
			}

			&.stroke {
				z-index: 0;
				-webkit-text-stroke: 22px var(--night-silhouette);
			}
		}

		.edition {
			position: absolute;
			right: 0;
			bottom: 0;
			z-index: 1;

			font-family: 'Press Start 2P', monospace;
			font-size: 48px;
			line-height: 1;
			letter-spacing: normal;
			text-transform: uppercase;
			color: var(--sunset-pink);
			paint-order: stroke fill;
			-webkit-text-stroke: 11px var(--night-silhouette);
			transform: rotate(-5deg);
		}
	}
</style>
