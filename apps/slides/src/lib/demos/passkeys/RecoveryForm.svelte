<script lang="ts">
	import type { RecoveryState } from '#lib/demos/demo-passkeys.svelte.ts';

	type Props = { authState: RecoveryState };
	const { authState }: Props = $props();

	let passkeyName = $state('');
	let busy = $state(false);

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		busy = true;
		try {
			await authState.recoverAccount(passkeyName);
		} finally {
			busy = false;
		}
	}
</script>

<h4>Nouvelle passkey</h4>
<p>Ce lien ne vous connecte pas : il permet seulement de créer une nouvelle passkey.</p>
<form onsubmit={submit}>
	<label>
		Nom de la passkey
		<input bind:value={passkeyName} name="passkeyName" autocomplete="off" required />
	</label>
	{#if authState.errorMessage}
		<p class="demo-error" role="alert">{authState.errorMessage}</p>
	{/if}
	<div class="demo-actions">
		<button disabled={busy}>Créer la passkey</button>
		<button type="button" class="link" disabled={busy} onclick={() => authState.toLogin()}>
			Retour à la connexion
		</button>
	</div>
</form>
