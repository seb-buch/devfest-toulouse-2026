<script lang="ts">
	import type {
		AuthenticationState,
		PasskeyAuthenticationState
	} from '#lib/demos/demo-hybrid.svelte.ts';
	import DemoFrame from '#lib/demos/DemoFrame.svelte';
	import LoginForm from './LoginForm.svelte';
	import RegistrationForm from './RegistrationForm.svelte';
	import AccountPanel from './AccountPanel.svelte';
	import MfaSetupPanel from './MfaSetupPanel.svelte';
	import MfaVerificationForm from './MfaVerificationForm.svelte';

	/*  Front-end de l'app auth-hybrid : une vue par état  */
	type Props = { authState: AuthenticationState | PasskeyAuthenticationState };
	const { authState }: Props = $props();
</script>

<DemoFrame>
	{#if authState.name === 'initial'}
		<p class="demo-status">Connexion à l'API…</p>
	{:else if authState.name === 'unavailable'}
		<p class="demo-status">Cette démo ne fonctionne qu'en mode live.</p>
	{:else if authState.name === 'login'}
		<LoginForm {authState} />
	{:else if authState.name === 'registration'}
		<RegistrationForm {authState} />
	{:else if authState.name === 'authenticated'}
		<AccountPanel {authState} />
	{:else if authState.name === 'mfa-setup'}
		<MfaSetupPanel {authState} />
	{:else if authState.name === 'mfa-verification'}
		<MfaVerificationForm {authState} />
	{/if}
</DemoFrame>
