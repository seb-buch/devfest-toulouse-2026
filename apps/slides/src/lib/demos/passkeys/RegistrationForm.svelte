<script lang="ts">
	import type { RegistrationState } from '#lib/demos/demo-passkeys.svelte.ts';

	type Props = { authState: RegistrationState };
	const { authState }: Props = $props();

	let displayName = $state('');
	let username = $state('');
	let email = $state('');
	let passkeyName = $state('');
	let busy = $state(false);

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		busy = true;
		try {
			await authState.register({ displayName, username, email, passkeyName });
		} finally {
			busy = false;
		}
	}
</script>

<h4>Créer un compte</h4>
<form onsubmit={submit}>
	<div class="demo-fields two-columns">
		<label>
			Nom affiché
			<input bind:value={displayName} name="displayName" autocomplete="name" required />
		</label>
		<label>
			Nom d'utilisateur
			<input bind:value={username} name="username" autocomplete="username" required />
		</label>
		<label>
			Email
			<input bind:value={email} name="email" type="email" autocomplete="email" required />
		</label>
		<label>
			Nom de la passkey
			<input
				bind:value={passkeyName}
				name="passkeyName"
				autocomplete="off"
				placeholder="Ordinateur"
			/>
		</label>
	</div>
	{#if authState.errorMessage}
		<p class="demo-error" role="alert">{authState.errorMessage}</p>
	{/if}
	<div class="demo-actions">
		<button disabled={busy}>Créer le compte</button>
		<button type="button" class="link" disabled={busy} onclick={() => authState.toLogin()}>
			J'ai déjà un compte
		</button>
	</div>
</form>
