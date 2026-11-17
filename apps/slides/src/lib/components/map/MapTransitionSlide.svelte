<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Slide } from '@seb-buch/slyd';
	import MapViewport from '#lib/components/map/MapViewport.svelte';
	import MapBackground from '#lib/components/map/MapBackground.svelte';
	import markers from '#lib/components/map/map-markers.json';
	import MapMarker from '#lib/components/map/MapMarker.svelte';
	import MapRoute, { type RouteName } from '#lib/components/map/MapRoute.svelte';
	import routes from '#lib/components/map/routes.generated.json';
	import {
		type MissionName,
		missionNumber,
		missions,
		type PositionName
	} from '#lib/components/map/map-info.ts';

	type Props = {
		route: RouteName;
		/** Reprend la carte de la diapo précédente (même view-transition-name) pendant le zoom. */
		sharedMap?: boolean;
		/** Notes de l'orateur propres à cette transition (un `<SpeakerNotes>`). */
		children?: Snippet;
	};

	const { route, sharedMap = false, children }: Props = $props();

	/*  Ordre du parcours : la route « to-X » relie la position précédant X à X  */
	const ORDER: PositionName[] = [
		'start',
		'mission-1',
		'mission-2',
		'mission-3',
		'mission-4',
		'end'
	];
	const destination = $derived(ORDER.indexOf(route.replace('to-', '') as PositionName));

	/*  Avant le départ : terminé ; départ : en cours de validation ; destination : active ; au-delà : à venir  */
	function statusOf(position: PositionName): 'complete' | 'completing' | 'active' | 'future' {
		const index = ORDER.indexOf(position);
		if (index < destination - 1) return 'complete';
		if (index === destination - 1) return 'completing';
		if (index === destination) return 'active';
		return 'future';
	}

	/*  Une route mène toujours à une mission (ou à l'arrivée), jamais au départ  */
	const place = $derived(missions[ORDER[destination] as MissionName].place);

	const MAP_WIDTH = 1920;
	const MAP_HEIGHT = 1080;
	/*  L'image de fond fait 1920×1080 : au-delà de ×2 elle devient floue  */
	const MAX_ZOOM = 2;
	/*  Marge autour du trajet ; en haut, la place des marqueurs plantés sur le chemin  */
	const MARGIN = 100;
	const MARKER_HEIGHT = 90;
	/*  Bas de l'écran réservé à l'objectif de mission  */
	const OBJECTIVE_HEIGHT = 120;

	/*  Tous les points du chemin SVG (points de contrôle compris, ils longent la courbe)  */
	function routeBounds(path: string) {
		const values = (path.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);
		const xs = values.filter((_, i) => i % 2 === 0);
		const ys = values.filter((_, i) => i % 2 === 1);
		return {
			left: Math.min(...xs) - MARGIN,
			right: Math.max(...xs) + MARGIN,
			top: Math.min(...ys) - MARGIN - MARKER_HEIGHT,
			bottom: Math.max(...ys) + MARGIN
		};
	}

	/*  Décalage qui centre le trajet sans jamais montrer l'extérieur de la carte  */
	function offset(
		center: number,
		available: number,
		mapSize: number,
		screenSize: number,
		zoom: number
	) {
		const centered = available / 2 - center * zoom;
		return Math.min(0, Math.max(screenSize - mapSize * zoom, centered));
	}

	/*  Cadrage du trajet : zoom maximal qui garde le chemin et ses marqueurs à l'écran  */
	const camera = $derived.by(() => {
		const bounds = routeBounds(routes[route]);
		const availableHeight = MAP_HEIGHT - OBJECTIVE_HEIGHT;
		const zoom = Math.min(
			MAX_ZOOM,
			MAP_WIDTH / (bounds.right - bounds.left),
			availableHeight / (bounds.bottom - bounds.top)
		);
		const x = offset((bounds.left + bounds.right) / 2, MAP_WIDTH, MAP_WIDTH, MAP_WIDTH, zoom);
		const y = offset(
			(bounds.top + bounds.bottom) / 2,
			availableHeight,
			MAP_HEIGHT,
			MAP_HEIGHT,
			zoom
		);
		return `translate(${x}px, ${y}px) scale(${zoom})`;
	});

	function markerName(position: PositionName): 'start' | 'end' | number {
		return missionNumber(position) ?? (position as 'start' | 'end');
	}
</script>

<!--
	Trois appuis sur Espace : zoom sur le trajet et objectif de mission (fragment 0),
	trajet de la voiture (fragment 1), puis diapo suivante.
-->
<Slide transition="zoom-in">
	<div class="map-container" class:shared={sharedMap}>
		<MapViewport>
			<div class="camera fragment custom" data-fragment-index="0" style:--camera={camera}>
				<MapBackground />
				<MapRoute fragmentIndex={1} {route} />
				{#each ORDER as position (position)}
					<MapMarker
						name={markerName(position)}
						position={markers[position]}
						status={statusOf(position)}
					/>
				{/each}
			</div>
		</MapViewport>
		<p class="objective fragment custom" data-fragment-index="0">
			Rendez-vous {@html place.preposition} <span class="location">{@html place.name}</span>
		</p>
	</div>
	{@render children?.()}
</Slide>

<style>
	.map-container {
		/*  Laisse le zoom-in de Slyd (0,4 s) se terminer avant de faire évoluer la carte  */
		--map-reveal-delay: 0.6s;
		--map-reveal-duration: 0.5s;

		position: absolute;
		top: 0;
		left: 0;
		width: 1920px;
		height: 1080px;
	}

	/*  Caméra : vue d'ensemble, puis cadrage du trajet quand le fragment est révélé  */
	.map-container .camera {
		position: absolute;
		top: 0;
		left: 0;
		width: 1920px;
		height: 1080px;
		transform-origin: top left;
		transition: transform 1.2s ease-in-out;

		&:global(.revealed) {
			transform: var(--camera);
		}
	}

	/*  Objectif de mission façon sous-titre de GTA V, hors caméra : il ne zoome pas  */
	.map-container .objective {
		position: absolute;
		bottom: 40px;
		left: 0;
		width: 100%;
		margin: 0;
		z-index: 4;

		font-family: 'Chalet London', var(--slyd-main-font), sans-serif;
		font-size: 44px;
		line-height: 1;
		text-align: center;
		color: #fff;
		-webkit-text-stroke: 8px var(--night-silhouette);
		paint-order: stroke fill;

		opacity: 0;
		transition: opacity 0.6s ease 0.6s;

		&:global(.revealed) {
			opacity: 1;
		}

		.location {
			padding-left: 0.2em;
			font-family: var(--script-font), sans-serif;
			font-size: 1.4em;
			color: var(--sunset-yellow);
		}
	}

	/*  Nom actif uniquement pendant un zoom : évite les doublons en vue d'ensemble  */
	:global(:root:active-view-transition-type(slyd-zoom-in, slyd-zoom-out)) .shared {
		view-transition-name: map;
	}

	:global(::view-transition-group(map)) {
		animation-duration: var(--slyd-zoom-duration);
		animation-timing-function: ease;
	}
</style>
