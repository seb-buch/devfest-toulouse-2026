<script lang="ts">
	import markers from './map-markers.json';
	import MapMarker from '#lib/components/map/MapMarker.svelte';
</script>

<MapMarker name="start" position={markers.start} />
<MapMarker name={1} position={markers['mission-1']} />
<MapMarker name={2} position={markers['mission-2']} />
<MapMarker name={3} position={markers['mission-3']} />
<MapMarker name={4} position={markers['mission-4']} />
<MapMarker name="end" position={markers.end} />
