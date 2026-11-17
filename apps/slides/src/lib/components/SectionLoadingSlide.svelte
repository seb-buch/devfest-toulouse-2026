<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';

	/*
	 * Écran de chargement de section façon GTA V : décor et personnage en deux calques animés.
	 * « Chargement » s'affiche en bas à droite, puis laisse place à « Appuyez sur Espace »
	 * après `loadingTime` secondes. Espace passe à la slide suivante à tout moment.
	 */
	type Props = {
		background: string;
		foreground: string;
		/** Durée du faux chargement, en secondes */
		loadingTime?: number;
		children?: Snippet;
	};

	const { background, foreground, loadingTime = 3, children }: Props = $props();

	let loaded = $state(false);
	let screen: HTMLElement;

	/*  Slyd monte toutes les slides au démarrage : le chargement démarre quand la slide devient courante  */
	function isCurrentSlide(slideIndex: number): boolean {
		const slides = [...document.querySelectorAll('.slyd-slide')];
		return slides.indexOf(screen.closest('.slyd-slide')!) === slideIndex;
	}

	onMount(() => {
		let timer: ReturnType<typeof setTimeout> | undefined;

		function restartLoading(event: CustomEvent<{ slideIndex: number }>) {
			clearTimeout(timer);
			if (!isCurrentSlide(event.detail.slideIndex)) return;
			loaded = false;
			timer = setTimeout(() => (loaded = true), loadingTime * 1000);
		}

		window.addEventListener('slyd:slidechange', restartLoading);
		return () => {
			clearTimeout(timer);
			window.removeEventListener('slyd:slidechange', restartLoading);
		};
	});
</script>

<Slide>
	<div bind:this={screen} class="night illustrated">
		<img alt="" class="layer background" src={background} />
		<img alt="" class="layer foreground" src={foreground} />
	</div>
	<p class="status">
		{#if loaded}
			<span class="ready">Appuyez sur <kbd>Espace</kbd> pour continuer</span>
		{:else}
			<span>Chargement<span class="dots"></span></span>
		{/if}
	</p>
	<SpeakerNotes>
		{@render children?.()}
	</SpeakerNotes>
</Slide>

<style>
	/*
   * Le décor est une carte inclinée en 3D qui pivote vers la position de face en reculant ;
   * le personnage, plat, déborde de la carte et glisse vers la droite. L'animation fait l'aller-retour.
   */

	.illustrated {
		perspective: 1800px;
	}

	.layer {
		position: absolute;
		object-fit: cover;
		animation: 15s ease-in-out infinite alternate both;
	}

	.background {
		top: 10%;
		left: 8%;
		width: 82%;
		height: 72%;
		transform-origin: 0% 50%;
		animation-name: card-turn;
	}

	.foreground {
		inset: 0;
		width: 100%;
		height: 100%;
		/*  Ancré en bas : la coupe aux cuisses reste au bord de l'écran, sous la carte  */
		transform-origin: 20% 100%;
		animation-name: character-slide;
	}

	/*
	 * Même nom de view transition que dans SectionTitleSlide : le personnage glisse vers la slide titre.
	 * Pas de nom en vue d'ensemble : toutes les slides y sont affichées, les noms seraient en double.
	 */
	:global(.slyd:not(.overview)) .foreground {
		view-transition-name: mission-character;
	}

	@keyframes card-turn {
		from {
			transform: rotateY(-12deg);
		}
		to {
			transform: translateZ(-120px) rotateY(0deg);
		}
	}

	@keyframes character-slide {
		from {
			transform: scale(0.86) translateX(1%);
		}
		to {
			transform: scale(0.86) translateX(11%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.layer {
			animation: none;
		}
	}

	/*  Statut sobre en bas à droite, comme l'indicateur de chargement de GTA  */
	.status {
		position: absolute;
		right: 70px;
		bottom: 50px;
		margin: 0;
		font-size: 32px;
		font-weight: 600;
		color: #fff;
		text-shadow: 0 2px 8px rgb(0 0 0 / 0.8);

		> span {
			animation: fade-in 0.4s ease-out;
		}

		kbd {
			display: inline-block;
			padding: 0 0.4em;
			border: 2px solid #fff;
			border-bottom-width: 5px;
			border-radius: 6px;
			font-family: inherit;
			font-size: 0.85em;
			line-height: 1.4;
		}
	}

	/*  Points de suspension animés ; largeur fixe pour que « Chargement » ne bouge pas  */
	.dots {
		display: inline-block;
		width: 1.2em;
		text-align: left;

		&::after {
			content: '';
			animation: dots 2s steps(1, end) infinite;
		}
	}

	@keyframes dots {
		0% {
			content: '';
		}
		25% {
			content: '.';
		}
		50% {
			content: '..';
		}
		75% {
			content: '...';
		}
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
	}
</style>
