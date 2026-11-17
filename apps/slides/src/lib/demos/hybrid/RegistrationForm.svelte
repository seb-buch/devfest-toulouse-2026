<script lang="ts">
	import type { UserRegistrationState } from '#lib/demos/demo-hybrid.svelte.ts';

	type Props = { authState: UserRegistrationState };
	const { authState }: Props = $props();

	let displayName = $state('');
	let username = $state('');
	let email = $state('');
	let password = $state('');
	let busy = $state(false);

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		busy = true;
		try {
			await authState.registerUser({ displayName, username, email, password });
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
			Mot de passe
			<input
				bind:value={password}
				name="password"
				type="password"
				autocomplete="new-password"
				minlength="8"
				required
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
