<script lang="ts">
	import type { RecoverySentState } from '#lib/demos/demo-passkeys.svelte.ts';

	type Props = { authState: RecoverySentState };
	const { authState }: Props = $props();

	/*  Onglet nommé : chaque ouverture réutilise le même onglet Mailpit  */
	const MAILPIT_URL = '/mail/';
	const MAILPIT_TAB = 'gta-passkeys-mailpit';
</script>

<h4>Lien envoyé</h4>
<p>Si un compte correspond à {authState.email}, un lien de récupération vient d'y être envoyé.</p>
<div class="demo-actions">
	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- Mailpit est servi par Caddy, hors de SvelteKit -->
	<a class="button" href={MAILPIT_URL} target={MAILPIT_TAB}>Ouvrir Mailpit&nbsp;↗</a>
	<button class="link" onclick={() => authState.toLogin()}>Retour à la connexion</button>
</div>
