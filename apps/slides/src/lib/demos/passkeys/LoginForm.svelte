<script lang="ts">
	import type { LoginState } from '#lib/demos/demo-passkeys.svelte.ts';
	import { slideVisibility } from '#lib/demos/slide-visibility.ts';

	type Props = { authState: LoginState };
	const { authState }: Props = $props();

	let username = $state('');
	let busy = $state(false);
	let slideIsCurrent = $state(false);
	let conditionalRequest: AbortController | undefined;

	/*
	 * Conditional UI : les passkeys sont proposées dans l'autocomplétion du champ identifiant.
	 * Une seule requête à la fois, uniquement quand la diapo est affichée, relancée à chaque nouvel état.
	 */
	$effect(() => {
		if (!slideIsCurrent) return;
		const controller = new AbortController();
		conditionalRequest = controller;
		void startConditionalUI(authState, controller.signal);
		return () => controller.abort();
	});

	async function startConditionalUI(state: LoginState, signal: AbortSignal) {
		if (!(await PublicKeyCredential.isConditionalMediationAvailable()) || signal.aborted) return;
		await state.signIn('', 'conditional', signal);
	}

	async function run(action: () => Promise<unknown>) {
		busy = true;
		try {
			await action();
		} finally {
			busy = false;
		}
	}

	function submit(event: SubmitEvent) {
		event.preventDefault();
		// Le navigateur n'accepte qu'une requête WebAuthn à la fois
		conditionalRequest?.abort();
		return run(() => authState.signIn(username, 'modal'));
	}
</script>

<h4>Connexion</h4>
<form onsubmit={submit} {@attach slideVisibility((isCurrent) => (slideIsCurrent = isCurrent))}>
	<label>
		Nom d'utilisateur
		<input bind:value={username} name="username" autocomplete="username webauthn" />
	</label>
	{#if authState.errorMessage}
		<p class="demo-error" role="alert">{authState.errorMessage}</p>
	{/if}
	<div class="demo-actions">
		<button disabled={busy}>Se connecter</button>
		<button type="button" class="link" disabled={busy} onclick={() => authState.toRegistration()}>
			Créer un compte
		</button>
		<button type="button" class="link" disabled={busy} onclick={() => authState.toRecovery()}>
			Passkeys perdues ?
		</button>
	</div>
</form>
