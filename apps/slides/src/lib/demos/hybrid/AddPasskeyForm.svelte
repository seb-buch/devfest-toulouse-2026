<script lang="ts">
	import type { PasskeyAuthenticatedState } from '#lib/demos/demo-hybrid.svelte.ts';

	type Props = { authState: PasskeyAuthenticatedState };
	const { authState }: Props = $props();

	let passkeyName = $state('');
	let busy = $state(false);

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		busy = true;
		try {
			await authState.addPasskey(passkeyName);
		} finally {
			busy = false;
		}
	}
</script>

<form class="add-passkey" onsubmit={submit}>
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
	.add-passkey {
		margin-top: 32px;
		padding-top: 24px;
		border-top: 3px dashed var(--night);
	}
</style>
