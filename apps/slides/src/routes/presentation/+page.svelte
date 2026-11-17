<script lang="ts">
	import { Presentation } from '@seb-buch/slyd';
	import '#lib/theme/theme.css';
	import '#lib/theme/additional.css';
	import ClassicTitleSlide from '../../slides/ClassicTitleSlide.svelte';
	import TitleSlide from '../../slides/TitleSlide.svelte';
	import MfaSection from '../../slides/MfaSection.svelte';
	import WebauthnSection from '../../slides/WebauthnSection.svelte';
	import MfaPasskeysSection from '../../slides/MfaPasskeysSection.svelte';
	import PasskeysSection from '../../slides/PasskeysSection.svelte';
	import ConclusionSection from '../../slides/ConclusionSection.svelte';
	import IntroductionSection from '../../slides/IntroductionSection.svelte';
</script>

<Presentation>
	<ClassicTitleSlide />
	<TitleSlide />
	<IntroductionSection />
	<MfaSection />
	<WebauthnSection />
	<MfaPasskeysSection />
	<PasskeysSection />
	<ConclusionSection />
</Presentation>
