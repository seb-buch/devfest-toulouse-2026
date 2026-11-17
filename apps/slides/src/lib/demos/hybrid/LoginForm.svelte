<script lang="ts">
	import type { PasskeyLoginState, UserLoginState } from '#lib/demos/demo-hybrid.svelte.ts';
	import { slideVisibility } from '#lib/demos/slide-visibility.ts';

	type Props = { authState: UserLoginState | PasskeyLoginState };
	const { authState }: Props = $props();

	/*  Mode « mfa+passkey » : l'état propose aussi la connexion par passkey  */
	const passkeyState = $derived('loginWithPasskey' in authState ? authState : undefined);

	let login = $state('');
	let password = $state('');
	let busy = $state(false);
	let slideIsCurrent = $state(false);
	let conditionalRequest: AbortController | undefined;

	/*
	 * Conditional UI : les passkeys sont proposées dans l'autocomplétion du champ identifiant.
	 * Une seule requête à la fois, uniquement quand la diapo est affichée, relancée à chaque nouvel état.
	 */
	$effect(() => {
		if (!passkeyState || !slideIsCurrent) return;
		const controller = new AbortController();
		conditionalRequest = controller;
		void startConditionalUI(passkeyState, controller.signal);
		return () => controller.abort();
	});

	async function startConditionalUI(state: PasskeyLoginState, signal: AbortSignal) {
		if (!(await PublicKeyCredential.isConditionalMediationAvailable()) || signal.aborted) return;
		await state.loginWithPasskey('conditional', signal);
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
		return run(() => authState.login({ login, password }));
	}

	function loginWithPasskey(state: PasskeyLoginState) {
		// Le navigateur n'accepte qu'une requête WebAuthn à la fois
		conditionalRequest?.abort();
		return run(() => state.loginWithPasskey('modal'));
	}
</script>

<h4>Connexion</h4>
<form onsubmit={submit} {@attach slideVisibility((isCurrent) => (slideIsCurrent = isCurrent))}>
	<div class="demo-fields">
		<label>
			Nom d'utilisateur ou email
			<input
				bind:value={login}
				name="login"
				autocomplete={passkeyState ? 'username webauthn' : 'username'}
				required
			/>
		</label>
		<label>
			Mot de passe
			<input
				bind:value={password}
				name="password"
				type="password"
				autocomplete="current-password"
				required
			/>
		</label>
	</div>
	{#if authState.errorMessage}
		<p class="demo-error" role="alert">{authState.errorMessage}</p>
	{/if}
	<div class="demo-actions">
		<button disabled={busy}>Se connecter</button>
		{#if passkeyState}
			<button
				type="button"
				class="secondary"
				disabled={busy}
				onclick={() => loginWithPasskey(passkeyState)}
			>
				Se connecter avec une passkey
			</button>
		{/if}
		<button type="button" class="link" disabled={busy} onclick={() => authState.toRegistration()}>
			Créer un compte
		</button>
	</div>
</form>
