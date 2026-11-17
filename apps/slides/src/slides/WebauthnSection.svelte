<script lang="ts">
	import WebauthnSectionTitle from './webauthn/WebauthnSectionTitle.svelte';
	import AsymmetricKeysSlide from './webauthn/AsymmetricKeysSlide.svelte';
	import SignatureAuthSlide from './webauthn/SignatureAuthSlide.svelte';
	import Fido2Slide from './webauthn/Fido2Slide.svelte';
	import PasskeyDefinitionSlide from './webauthn/PasskeyDefinitionSlide.svelte';
	import RegistrationCeremonySlide from './webauthn/RegistrationCeremonySlide.svelte';
	import AuthenticationCeremonySlide from './webauthn/AuthenticationCeremonySlide.svelte';
	import DiscoverableOptionsSlide from './webauthn/DiscoverableOptionsSlide.svelte';
	import UserVerificationOptionSlide from './webauthn/UserVerificationOptionSlide.svelte';
	import IdentityOptionsSlide from './webauthn/IdentityOptionsSlide.svelte';
	import RegistrationOptionsSlide from './webauthn/RegistrationOptionsSlide.svelte';
	import WebauthnConclusionSlide from './webauthn/WebauthnConclusionSlide.svelte';
	import MapTransitionSlide from '#lib/components/map/MapTransitionSlide.svelte';
	import { SpeakerNotes } from '@seb-buch/slyd';
</script>

<MapTransitionSlide route="to-mission-2">
	<SpeakerNotes>
		Et cela nous amène à la deuxième mission, qui va nous faire aller de l'aéroport au centre-ville
		et à la bibliothèque.
	</SpeakerNotes>
</MapTransitionSlide>
<WebauthnSectionTitle />
<AsymmetricKeysSlide />
<SignatureAuthSlide />
<Fido2Slide />
<PasskeyDefinitionSlide />
<RegistrationCeremonySlide />
<AuthenticationCeremonySlide />
<DiscoverableOptionsSlide />
<UserVerificationOptionSlide />
<IdentityOptionsSlide />
<RegistrationOptionsSlide />
<WebauthnConclusionSlide />
