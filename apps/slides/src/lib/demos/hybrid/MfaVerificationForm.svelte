<script lang="ts">
	import type { MfaVerificationState } from '#lib/demos/demo-hybrid.svelte.ts';

	type Props = { authState: MfaVerificationState };
	const { authState }: Props = $props();

	let code = $state('');
	let busy = $state(false);

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		busy = true;
		try {
			await authState.verifyTotp(code);
		} finally {
			busy = false;
		}
	}
</script>

<h4>Double authentification</h4>
<form onsubmit={submit}>
	<p>Saisissez le code affiché par votre application d'authentification.</p>
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
	</div>
</form>
