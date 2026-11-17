<script lang="ts">
	import type {
		AuthenticatedState,
		PasskeyAuthenticatedState
	} from '#lib/demos/demo-hybrid.svelte.ts';
	import AddPasskeyForm from './AddPasskeyForm.svelte';

	type Props = { authState: AuthenticatedState | PasskeyAuthenticatedState };
	const { authState }: Props = $props();

	let askingPassword = $state(false);
	let password = $state('');
	let busy = $state(false);

	async function run(action: () => Promise<unknown>) {
		busy = true;
		try {
			await action();
		} finally {
			busy = false;
		}
	}

	function setupMfa(event: SubmitEvent) {
		event.preventDefault();
		return run(() => authState.setupMfa(password));
	}
</script>

<h4>Bienvenue {authState.user.username}</h4>
<p>{authState.user.email}</p>
<p>
	Double authentification :
	<span class={['demo-badge', { active: authState.user.mfaEnabled }]}>
		{authState.user.mfaEnabled ? 'activée' : 'désactivée'}
	</span>
</p>

{#if askingPassword}
	<form onsubmit={setupMfa}>
		<label>
			Confirmez votre mot de passe
			<input
				bind:value={password}
				name="password"
				type="password"
				autocomplete="current-password"
				required
			/>
		</label>
		{#if authState.errorMessage}
			<p class="demo-error" role="alert">{authState.errorMessage}</p>
		{/if}
		<div class="demo-actions">
			<button disabled={busy}>Continuer</button>
			<button
				type="button"
				class="secondary"
				disabled={busy}
				onclick={() => (askingPassword = false)}
			>
				Annuler
			</button>
		</div>
	</form>
{:else}
	<div class="demo-actions">
		{#if !authState.user.mfaEnabled}
			<button disabled={busy} onclick={() => (askingPassword = true)}>
				Activer la double authentification
			</button>
		{/if}
		<button class="secondary" disabled={busy} onclick={() => run(() => authState.logout())}>
			Se déconnecter
		</button>
	</div>
	{#if 'addPasskey' in authState}
		<AddPasskeyForm {authState} />
	{/if}
{/if}
