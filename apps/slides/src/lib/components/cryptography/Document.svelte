<script lang="ts">
	type Props = {
		state?: 'unsigned' | 'signed' | 'verified';
	};

	const { state = 'unsigned' }: Props = $props();
</script>

<!--  Document BD ; une fois signé ou vérifié, un tampon est apposé dessus  -->
<div class="document">
	<svg aria-hidden="true" viewBox="0 0 100 124">
		<path class="page" d="M 6 4 H 68 L 94 30 V 118 H 6 Z" />
		<path class="corner" d="M 68 4 V 30 H 94 Z" />
		<path class="line" d="M 20 46 H 80 M 20 60 H 72 M 20 74 H 56 M 20 88 H 78 M 20 102 H 66" />
	</svg>
	{#if state === 'signed'}
		<span class="stamp signed">Signé</span>
	{:else if state === 'verified'}
		<span class="stamp verified">Vérifié</span>
	{/if}
</div>

<style>
	.document {
		position: relative;
		width: 170px;
		height: 211px;

		svg {
			width: 100%;
			height: 100%;
			overflow: visible;
		}

		path {
			stroke: var(--night-silhouette);
			stroke-width: 4;
			stroke-linejoin: round;
			stroke-linecap: round;
		}

		.page {
			fill: #fff;
		}

		.corner {
			fill: #d9cfe8;
		}

		.line {
			fill: none;
			stroke-width: 3.5;
			opacity: 0.35;
		}
	}

	/*  Tampon encreur : contour épais, texte en capitales, incliné  */
	.stamp {
		position: absolute;
		left: 50%;
		top: 58%;
		translate: -50% -50%;
		rotate: -16deg;
		padding: 0 12px;
		border: 5px solid currentColor;
		border-radius: 8px;
		background: rgb(255 255 255 / 0.85);
		font-family: var(--slyd-headings-font), sans-serif;
		font-size: 40px;
		line-height: 1.25;
		text-transform: uppercase;
		letter-spacing: 2px;
		white-space: nowrap;

		&.signed {
			color: var(--slyd-headings-color);
		}

		&.verified {
			color: #0b6f78;
		}
	}
</style>
