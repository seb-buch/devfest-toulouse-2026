<script lang="ts">
	import type { RecoveryRequestState } from '#lib/demos/demo-passkeys.svelte.ts';

	type Props = { authState: RecoveryRequestState };
	const { authState }: Props = $props();

	let email = $state('');
	let busy = $state(false);

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		busy = true;
		try {
			await authState.requestRecovery(email);
		} finally {
			busy = false;
		}
	}
</script>

<h4>Récupérer son compte</h4>
<p>Un lien pour créer une nouvelle passkey sera envoyé à l'adresse du compte.</p>
<form onsubmit={submit}>
	<label>
		Email
		<input bind:value={email} name="email" type="email" autocomplete="email" required />
	</label>
	{#if authState.errorMessage}
		<p class="demo-error" role="alert">{authState.errorMessage}</p>
	{/if}
	<div class="demo-actions">
		<button disabled={busy}>Recevoir un lien</button>
		<button type="button" class="link" disabled={busy} onclick={() => authState.toLogin()}>
			Retour à la connexion
		</button>
	</div>
</form>
