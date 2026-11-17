<script lang="ts">
	// Silhouettes de palmiers pour les diapos sombres (.night), dessinées dans un repère 1920×1080.

	type Frond = { angle: number; length: number };
	type Palm = { x: number; height: number; lean: number; scale: number };

	const FRONDS: Frond[] = [
		{ angle: -70, length: 1 },
		{ angle: -35, length: 1.1 },
		{ angle: -5, length: 1.2 },
		{ angle: 25, length: 1.05 },
		{ angle: 55, length: 0.85 }
	];

	const PALMS: Palm[] = [
		{ x: 70, height: 760, lean: 120, scale: 1.15 },
		{ x: 250, height: 560, lean: -60, scale: 0.85 },
		{ x: 1700, height: 820, lean: -140, scale: 1.2 },
		{ x: 1880, height: 520, lean: 40, scale: 0.8 }
	];

	function trunkPath({ x, height, lean }: Palm): string {
		const top = 1080 - height;
		const midY = 1080 - height / 2;
		return `M ${x - 22} 1080 Q ${x + lean * 0.2} ${midY} ${x + lean - 8} ${top}
			L ${x + lean + 8} ${top} Q ${x + lean * 0.2 + 26} ${midY} ${x + 22} 1080 Z`;
	}

	// Feuille orientée vers la droite, qui retombe en bout : on la tourne / retourne autour de la couronne.
	const FROND_PATH = 'M 0 0 Q 120 -70 260 30 Q 200 0 150 -2 Q 80 -8 0 14 Z';
</script>

<svg class="palms" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
	{#each PALMS as palm, i (i)}
		{@const crownX = palm.x + palm.lean}
		{@const crownY = 1080 - palm.height}
		<path d={trunkPath(palm)} />
		<g transform="translate({crownX} {crownY}) scale({palm.scale})">
			{#each FRONDS as frond, j (j)}
				<path d={FROND_PATH} transform="rotate({frond.angle}) scale({frond.length})" />
				<path d={FROND_PATH} transform="scale(-1 1) rotate({frond.angle}) scale({frond.length})" />
			{/each}
			<circle cx="-10" cy="16" r="13" />
			<circle cx="12" cy="20" r="13" />
		</g>
	{/each}
</svg>

<style>
	.palms {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		fill: var(--night-silhouette);
		pointer-events: none;
	}
</style>
