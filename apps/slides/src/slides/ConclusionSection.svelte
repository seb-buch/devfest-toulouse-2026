<script lang="ts">
	import ConclusionSectionTitle from './conclusion/ConclusionSectionTitle.svelte';
	import MissionsReviewSlide from './conclusion/MissionsReviewSlide.svelte';
	import GettingStartedSlide from './conclusion/GettingStartedSlide.svelte';
	import ChecklistSlide from './conclusion/ChecklistSlide.svelte';
	import ToolsSlide from './conclusion/ToolsSlide.svelte';
	import NextMissionsSlide from './conclusion/NextMissionsSlide.svelte';
	import ThanksSlide from './conclusion/ThanksSlide.svelte';
	import BackendLibrariesSlide from './conclusion/BackendLibrariesSlide.svelte';
	import PasskeyStorageSlide from './passkeys/PasskeyStorageSlide.svelte';
	import MapTransitionSlide from '#lib/components/map/MapTransitionSlide.svelte';
</script>

<MapTransitionSlide route="to-end" />
<ConclusionSectionTitle />
<MissionsReviewSlide />
<GettingStartedSlide />
<ToolsSlide />
<NextMissionsSlide />
<ThanksSlide />
<!-- Annexe : ressources à consulter pendant les questions -->
<ChecklistSlide />
<BackendLibrariesSlide />
<PasskeyStorageSlide />
