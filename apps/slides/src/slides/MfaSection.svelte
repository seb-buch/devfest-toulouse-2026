<script lang="ts">
	import MfaSectionTitle from './mfa/MfaSectionTitle.svelte';
	import DemoAuthenticationMFASlides from './mfa/DemoAuthenticationMFASlides.svelte';
	import MfaConclusionSlide from './mfa/MfaConclusionSlide.svelte';
	import MapTransitionSlide from '#lib/components/map/MapTransitionSlide.svelte';
	import { SpeakerNotes } from '@seb-buch/slyd';
</script>

<MapTransitionSlide route="to-mission-1" sharedMap>
	<SpeakerNotes>
		Mais justement, je vous propose de plonger vers notre première mission qui va nous amener à
		l'aéroport terminal 2F4.
	</SpeakerNotes>
</MapTransitionSlide>
<MfaSectionTitle />
<DemoAuthenticationMFASlides />
<MfaConclusionSlide />
