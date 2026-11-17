<script lang="ts">
	import { Slide, SpeakerNotes, VerticalSpacer } from '@seb-buch/slyd';
	import MapBackground from '#lib/components/map/MapBackground.svelte';
	import MapViewport from '#lib/components/map/MapViewport.svelte';
	import MapMarkers from '#lib/components/map/MapMarkers.svelte';
</script>

<Slide>
	<h3>La carte</h3>
	<VerticalSpacer height="2em" />
	<div class="map-container">
		<MapViewport>
			<MapBackground />
			<MapMarkers />
		</MapViewport>
	</div>
	<SpeakerNotes>
		Et pour ça, comme dans le vrai GTA, on va avoir une carte dans laquelle on va se balader pour
		aller de mission en mission.
	</SpeakerNotes>
</Slide>

<style>
	.map-container {
		position: relative;
		margin: auto;
		height: 800px;
		aspect-ratio: 16/9;
		background: #19b8c4;
	}

	/*  Carte partagée avec la première diapo de transition : elle grandit jusqu'au plein écran  */
	:global(:root:active-view-transition-type(slyd-zoom-in, slyd-zoom-out)) .map-container {
		view-transition-name: map;
	}
</style>
