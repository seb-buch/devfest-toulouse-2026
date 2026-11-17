<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
	import PasskeysDemoApp from '#lib/demos/passkeys/PasskeysDemoApp.svelte';
	import { getPasskeysDemoState, recoveryToken } from '#lib/demos/demo-passkeys.svelte.ts';

	/*  Diapo de démo de l'app 100 % passkeys : même état partagé par toutes les diapos  */
	type Props = {
		title: string;
		notes: Snippet;
		/** Diapo ouverte par le lien de récupération du mail */
		recovery?: boolean;
	};

	const { title, notes, recovery = false }: Props = $props();

	const auth = $derived(getPasskeysDemoState());
	let heading: HTMLElement;

	onMount(() => {
		if (auth.name === 'initial') void auth.initialize();
		if (recovery && recoveryToken) showThisSlideFirst();
	});

	/*
	 * Slyd lit le numéro de diapo dans le hash après le montage des diapos :
	 * on y met le numéro de celle-ci (ce qui retire aussi le token de l'URL).
	 */
	function showThisSlideFirst() {
		const slides = [...document.querySelectorAll('.slyd-slide')];
		const slideIndex = slides.indexOf(heading.closest('.slyd-slide')!);
		history.replaceState(null, '', `#${slideIndex + 1}`);
	}
</script>

<Slide>
	<h3 bind:this={heading}>{title}</h3>
	<div class="demo-stage">
		<PasskeysDemoApp authState={auth} />
	</div>
	<SpeakerNotes>
		{@render notes()}
	</SpeakerNotes>
</Slide>
