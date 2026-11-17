<script lang="ts">
	import { QRCode } from '@seb-buch/slyd';
	import type { MfaSetupState } from '#lib/demos/demo-hybrid.svelte.ts';

	type Props = { authState: MfaSetupState };
	const { authState }: Props = $props();

	let code = $state('');
	let busy = $state(false);

	async function run(action: () => Promise<unknown>) {
		busy = true;
		try {
			await action();
		} finally {
			busy = false;
		}
	}

	function verify(event: SubmitEvent) {
		event.preventDefault();
		return run(() => authState.verifyTotp(code));
	}
</script>

<h4>Activer la double authentification</h4>
<div class="setup">
	<QRCode url={authState.totpURI} size="360px" />
	<form onsubmit={verify}>
		<p>
			Scannez ce QR code avec votre application d'authentification, puis saisissez le code affiché.
		</p>
		<label>
			Code à 6 chiffres
			<input
				bind:value={code}
				class="demo-code"
				name="code"
				autocomplete="one-time-code"
				inputmode="numeric"
				pattern={'\\d{6}'}
				maxlength="6"
				required
			/>
		</label>
		{#if authState.errorMessage}
			<p class="demo-error" role="alert">{authState.errorMessage}</p>
		{/if}
		<div class="demo-actions">
			<button disabled={busy}>Valider</button>
			<button
				type="button"
				class="secondary"
				disabled={busy}
				onclick={() => run(() => authState.cancel())}
			>
				Annuler
			</button>
		</div>
	</form>
</div>

<style>
	.setup {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: center;
		gap: 56px;
	}
</style>
