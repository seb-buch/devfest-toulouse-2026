<script lang="ts">
	import type { AuthenticatedState, Passkey } from '#lib/demos/demo-passkeys.svelte.ts';

	type Props = { authState: AuthenticatedState };
	const { authState }: Props = $props();

	let passkeyName = $state('');
	let busy = $state(false);

	/*  La dernière passkey ne peut pas être supprimée : le compte n'aurait plus d'accès  */
	const isLastPasskey = $derived(authState.passkeys.length === 1);

	async function run(action: () => Promise<unknown>) {
		busy = true;
		try {
			await action();
		} finally {
			busy = false;
		}
	}

	function addPasskey(event: SubmitEvent) {
		event.preventDefault();
		return run(() => authState.addPasskey(passkeyName));
	}

	const formatDate = (timestamp: number) =>
		new Date(timestamp).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });

	function describe({ deviceType, backedUp, lastUsedAt }: Passkey) {
		return [
			deviceType === 'multiDevice' ? 'synchronisable' : 'liée à l’appareil',
			backedUp ? 'sauvegardée' : 'non sauvegardée',
			lastUsedAt ? `utilisée le ${formatDate(lastUsedAt)}` : 'jamais utilisée'
		].join(' · ');
	}
</script>

<div class="header">
	<h4>Bienvenue {authState.user.displayName}</h4>
	<button class="secondary" disabled={busy} onclick={() => run(() => authState.logout())}>
		Se déconnecter
	</button>
</div>
<p>{authState.user.username} · {authState.user.email}</p>

<ul class="passkeys">
	{#each authState.passkeys as passkey (passkey.credentialId)}
		<li>
			<div>
				<strong>{passkey.name}</strong>
				<span>{describe(passkey)}</span>
			</div>
			<button
				class="secondary"
				disabled={busy || isLastPasskey}
				onclick={() => run(() => authState.deletePasskey(passkey.credentialId))}
			>
				Supprimer
			</button>
		</li>
	{/each}
</ul>

<form onsubmit={addPasskey}>
	<div class="demo-inline">
		<label>
			Nom de la passkey
			<input bind:value={passkeyName} name="passkeyName" autocomplete="off" required />
		</label>
		<button disabled={busy}>Ajouter une passkey</button>
	</div>
	{#if authState.errorMessage}
		<p class="demo-error" role="alert">{authState.errorMessage}</p>
	{:else if authState.infoMessage}
		<p class="demo-info" role="status">{authState.infoMessage}</p>
	{/if}
</form>

<style>
	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;

		h4 {
			margin: 0;
		}
	}

	.passkeys {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin: 8px 0 24px;
		padding: 0;
		list-style: none;

		li {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 24px;
			padding: 10px 20px;
			border: 3px solid var(--night);
			border-radius: 8px;
		}

		div {
			display: flex;
			flex-direction: column;
		}

		span {
			font-size: 22px;
		}

		button {
			padding: 6px 20px;
			font-size: 24px;
		}
	}
</style>
