<script lang="ts">
	import { onMount } from 'svelte';
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
	import HybridDemoApp from '#lib/demos/hybrid/HybridDemoApp.svelte';
	import { getMfaDemoState } from '#lib/demos/demo-hybrid.svelte.ts';

	const auth = $derived(getMfaDemoState());

	onMount(() => {
		if (auth.name === 'initial') void auth.initialize();
	});
</script>

<Slide>
	<h3>Double contrôle</h3>
	<div class="demo-stage">
		<HybridDemoApp authState={auth} />
	</div>
	<SpeakerNotes>
		Alors ça c'est un type d'authentification que vous connaissez bien. Là on arrive pour le
		première fois sur l'application, donc évidemment on n'a pas de compte, il faut commencer par se
		créer un compte. Je me crée un compte avec le nom à afficher, le nom d'utilisateur, l'email
		associé et le mot de passe. On peut enusuite se connecter. Une fois connecté, on va pouvoir
		activer maintenant la double authentification. Il nous demande notre mot de passe pour confirmer
		la création et on a un QR code qui s'affiche. QR code qu'on va scanner. Et quand on fait ça,
		cela va lancer notre application d'authentification dans laquelle va s'ajouter le secret pour
		créer un jeton unique. Logiquement, on va rentrer le code et on a activée l'authentification à
		double facteur. À partir de ce moment là, quand on veut se connecter, on doit rentrer le code à
		six chiffres qui va changer toutes les 30 secondes. Et voilà on est connecté !
	</SpeakerNotes>
</Slide>
