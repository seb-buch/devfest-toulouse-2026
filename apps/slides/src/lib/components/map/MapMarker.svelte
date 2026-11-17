<script lang="ts">
	type PositionName = 'start' | 'end' | number;
	type Position = {
		x: number;
		y: number;
	};

	type Props = {
		name: PositionName;
		position: Position;
		/** `completing` : mission tout juste terminée, validée sous les yeux du public. */
		status?: 'active' | 'future' | 'complete' | 'completing';
	};

	const BLIP_PATH = 'M16 40 L9 28.12 A14 14 0 1 1 23 28.12 Z';
	const START_ICON = '\uf04b';
	const END_ICON = '';
	const DONE_ICON = '\ue63f';

	const { name, position, status = 'active' }: Props = $props();

	const isMission = $derived(typeof name === 'number');
	const isDone = $derived(isMission && (status === 'complete' || status === 'completing'));
	/*  Seule une mission se valide : le point de départ reste un marqueur actif  */
	const isCompleting = $derived(isMission && status === 'completing');

	const kind = $derived(isDone ? 'complete' : isMission ? 'mission' : name);
	const label = $derived.by(() => {
		if (isDone) {
			return DONE_ICON;
		}
		return name === 'start' ? START_ICON : name === 'end' ? END_ICON : String(name);
	});
</script>

<div
	class="marker {kind}"
	class:dimmed={status === 'future' || status === 'complete'}
	class:completing={isCompleting}
	style:left="{position.x}px"
	style:top="{position.y}px"
>
	<svg aria-hidden="true" class="blip" viewBox="-4 -4 40 48">
		<path class="outline" d={BLIP_PATH} />
		<path class="body" d={BLIP_PATH} />
		<circle class="disc" cx="16" cy="16" r="12.5" />
	</svg>
	<span class="label">{label}</span>
	{#if isCompleting}
		<span class="label number">{name}</span>
	{/if}
</div>

<style>
	.marker {
		--blip-color: #f0c850;

		position: absolute;
		width: 64px;
		aspect-ratio: 40 / 48;
		/* la pointe (bas-centre) tombe exactement sur (x, y) */
		translate: -50% -76px;
		z-index: 2;
	}

	.dimmed {
		opacity: 0.3;
	}

	/*  Diapo courante : le marqueur reste visible le temps du zoom puis s'estompe  */
	:global(.slyd-slide.current) .dimmed {
		animation: marker-dim var(--map-reveal-duration, 0s) ease var(--map-reveal-delay, 0s) both;
	}

	@keyframes marker-dim {
		from {
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.slyd-slide.current) .dimmed {
			animation: none;
		}
	}

	/*
	 * Diapo courante : la mission terminée arrive avec son numéro, rebondit sur sa pointe
	 * puis bascule sur la coche une fois le zoom terminé.
	 */
	.completing {
		transform-origin: 50% 100%;
	}

	.number {
		opacity: 0;
	}

	:global(.slyd-slide.current) .completing {
		--validation: 0.6s ease var(--map-reveal-delay, 0s) both;

		animation: marker-bounce var(--validation);

		.disc {
			animation: disc-validate var(--validation);
		}

		.label:not(.number) {
			animation: check-appear var(--validation);
		}

		.number {
			animation: number-disappear var(--validation);
		}
	}

	@keyframes marker-bounce {
		50% {
			scale: 1.35;
		}
	}

	@keyframes disc-validate {
		0%,
		45% {
			fill: #f0c850;
		}
	}

	@keyframes check-appear {
		0%,
		45% {
			opacity: 0;
		}
	}

	@keyframes number-disappear {
		0%,
		45% {
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.slyd-slide.current) .completing,
		:global(.slyd-slide.current) .completing :is(.disc, .label) {
			animation: none;
		}
	}

	.start {
		--blip-color: #5db6e5;

		.label {
			left: 2px;
		}
	}

	.end {
		--blip-color: #72cc72;

		.label {
			top: 12px;
			font-size: 38px;
		}
	}

	.complete {
		--blip-color: #cdcdcd;
	}

	.blip {
		width: 100%;
		height: 100%;
		overflow: visible;
		stroke-linejoin: round;
	}

	.outline {
		fill: #111;
		stroke: #111;
		stroke-width: 8;
	}

	.body {
		fill: #fff;
		stroke: #fff;
		stroke-width: 3;
	}

	.disc {
		fill: var(--blip-color);
	}

	.label {
		position: absolute;
		top: 16px;
		width: 100%;
		height: 1em;

		display: flex;
		align-items: center;
		justify-content: center;
		font-family: 'JetBrainsMono Nerd Font Mono', monospace;
		font-weight: 700;
		font-size: 32px;
		line-height: 1;
		color: #fff;
		-webkit-text-stroke: 6px #111;
		paint-order: stroke fill;
	}
</style>
