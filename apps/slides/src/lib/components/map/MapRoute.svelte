<script lang="ts">
	import routes from '#lib/components/map/routes.generated.json';

	export type RouteName = keyof typeof routes;

	type Props = {
		route: RouteName;
		/** Fragment Slyd qui déclenche le trajet. */
		fragmentIndex?: number;
	};

	const { route, fragmentIndex = 0 }: Props = $props();

	const path = $derived(routes[route]);
</script>

<!--
	Itinéraire GPS et voiture forment un seul fragment, déclenché par Espace :
	la voiture parcourt le chemin et la route s'efface derrière elle.
-->
<div class="map-route">
	<svg class="route" viewBox="0 0 1920 1080" aria-hidden="true">
		<path
			class="outline fragment custom"
			data-fragment-index={fragmentIndex}
			d={path}
			pathLength="1"
		/>
		<path
			class="line fragment custom"
			data-fragment-index={fragmentIndex}
			d={path}
			pathLength="1"
		/>
	</svg>

	<!--  Voiture vue de dessus, avant vers la droite : offset-rotate l'oriente dans le sens du chemin  -->
	<svg
		class="car fragment custom"
		data-fragment-index={fragmentIndex}
		style:offset-path="path('{path}')"
		viewBox="0 0 48 24"
		aria-hidden="true"
	>
		<rect class="body" x="2" y="2" width="44" height="20" rx="7" />
		<rect class="glass" x="29" y="5" width="7" height="14" rx="2" />
		<rect class="glass" x="8" y="6" width="5" height="12" rx="2" />
		<rect class="headlight" x="43" y="4" width="3" height="4" rx="1" />
		<rect class="headlight" x="43" y="16" width="3" height="4" rx="1" />
	</svg>
</div>

<style>
	.map-route {
		--travel-duration: 3s;
		--route-color: #f0c850;

		position: absolute;
		top: 0;
		left: 0;
		width: 1920px;
		height: 1080px;
		pointer-events: none;
	}

	/*  Diapo courante : l'itinéraire apparaît une fois le zoom terminé. Animé sur les enfants :
	    sur le conteneur, l'opacité animée en ferait un contexte d'empilement et la voiture passerait
	    sous les marqueurs et les noms de quartiers  */
	:global(.slyd-slide.current) .map-route > * {
		animation: route-appear var(--map-reveal-duration, 0s) ease var(--map-reveal-delay, 0s) both;
	}

	@keyframes route-appear {
		from {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.slyd-slide.current) .map-route > * {
			animation: none;
		}
	}

	.route {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		z-index: 1;

		path {
			fill: none;
			stroke-linecap: round;
			stroke-linejoin: round;
			/*  Un tiret de la longueur du chemin : le décaler efface le chemin depuis le départ  */
			stroke-dasharray: 1 1;
			stroke-dashoffset: 0;
			transition: stroke-dashoffset var(--travel-duration) ease-in-out;

			&:global(.revealed) {
				stroke-dashoffset: -1;
			}
		}

		.outline {
			stroke: #111;
			stroke-width: 16;
		}

		.line {
			stroke: var(--route-color);
			stroke-width: 10;
		}
	}

	/*  Positionnée le long du chemin SVG (offset-path), du début à la fin  */
	.car {
		position: absolute;
		top: 0;
		left: 0;
		width: 48px;
		height: 24px;
		offset-rotate: auto;
		offset-distance: 0%;
		transition: offset-distance var(--travel-duration) ease-in-out;
		filter: drop-shadow(0 3px 3px rgb(0 0 0 / 0.6));
		z-index: 3;

		&:global(.revealed) {
			offset-distance: 100%;
		}

		.body {
			fill: var(--sunset-pink);
			stroke: #111;
			stroke-width: 2;
		}

		.glass {
			fill: #2a1257;
		}

		.headlight {
			fill: #fff6c8;
		}
	}
</style>
