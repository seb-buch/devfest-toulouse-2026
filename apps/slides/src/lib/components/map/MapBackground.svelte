<script lang="ts">
	import background from '#lib/assets/slides/map/devfest-city-map.webp';

	type InterestPoint = {
		name: string;
		x: number;
		y: number;
	};
	const interestPoints: InterestPoint[] = [
		{
			name: `\uee78&nbsp;DevFest&nbsp;City International Airport`,
			x: 710,
			y: 250
		},
		{
			name: 'DOWNTOWN',
			x: 1200,
			y: 450
		},
		{
			name: 'la vaca',
			x: 1150,
			y: 250
		},
		{
			name: 'Hotmount hills',
			x: 1300,
			y: 350
		},
		{
			name: `south devfest&nbsp;city`,
			x: 1100,
			y: 650
		},
		{
			name: 'Tech park',
			x: 1680,
			y: 925
		},
		{
			name: 'UNIVERSITY HEIGHTS',
			x: 1250,
			y: 850
		},
		{
			name: `West<br/>DevFest&nbsp;city`,
			x: 800,
			y: 550
		},
		{
			name: 'spinningwood',
			x: 500,
			y: 650
		},
		{
			name: 'castel fields',
			x: 1700,
			y: 300
		},
		{
			name: 'Space city',
			x: 1450,
			y: 700
		},
		{
			name: 'Cerveza Road',
			x: 950,
			y: 900
		},
		{
			name: 'Swallow meadows',
			x: 200,
			y: 1000
		}
	];
</script>

<div class="map">
	<img alt="Passkeys City Map background" class="background" src={background} />

	<p class="title">Passkeys City</p>
	<div class="labels">
		{#each interestPoints as interestPoint (interestPoint.name)}
			<p class="interest-point" style="top: {interestPoint.y}px; left: {interestPoint.x}px;">
				{@html interestPoint.name}
			</p>
		{/each}
	</div>
</div>

<style>
	.map {
		position: relative;
		width: 1920px;
		height: 1080px;

		* {
			position: absolute;
		}

		img {
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: 0;
		}

		.title {
			z-index: 1;
			top: 40px;
			left: 60px;
			margin: 0;
			width: 300px;

			font-family: 'Press Start 2P', monospace;
			font-size: 64px;
			color: #ffffff;
			-webkit-text-stroke: 0.8rem var(--night-silhouette);
			paint-order: stroke fill;
			filter: drop-shadow(8px 10px 0 var(--night-silhouette));
		}

		.labels {
			z-index: 1;

			.interest-point {
				font-size: 20px;
				line-height: 1em;
				font-weight: bold;
				text-align: center;
				text-transform: uppercase;
				font-style: italic;
				font-family: 'JetBrainsMono Nerd Font Mono', sans-serif;
				z-index: 1;
				translate: -50% -50%;
			}
		}
	}
</style>
