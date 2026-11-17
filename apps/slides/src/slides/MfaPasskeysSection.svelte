<script lang="ts">
	import MfaPasskeysSectionTitle from './mfa+passkeys/MfaPasskeysSectionTitle.svelte';
	import DemoAuthenticationPasskeySlides from './mfa+passkeys/DemoAuthenticationPasskeySlides.svelte';
	import MfaPasskeysConclusionSlide from './mfa+passkeys/MfaPasskeysConclusionSlide.svelte';
	import MapTransitionSlide from '#lib/components/map/MapTransitionSlide.svelte';
</script>

<MapTransitionSlide route="to-mission-3" />
<MfaPasskeysSectionTitle />
<DemoAuthenticationPasskeySlides />
<MfaPasskeysConclusionSlide />
