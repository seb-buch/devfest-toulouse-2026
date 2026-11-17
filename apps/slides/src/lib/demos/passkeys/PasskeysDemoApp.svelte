<script lang="ts">
	import type { PasskeysDemoState } from '#lib/demos/demo-passkeys.svelte.ts';
	import DemoFrame from '#lib/demos/DemoFrame.svelte';
	import LoginForm from './LoginForm.svelte';
	import RegistrationForm from './RegistrationForm.svelte';
	import AccountPanel from './AccountPanel.svelte';
	import RecoveryRequestForm from './RecoveryRequestForm.svelte';
	import RecoverySentPanel from './RecoverySentPanel.svelte';
	import RecoveryForm from './RecoveryForm.svelte';

	/*  Front-end de l'app auth-passkeys : une vue par état  */
	type Props = { authState: PasskeysDemoState };
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
	{:else if authState.name === 'recovery-request'}
		<RecoveryRequestForm {authState} />
	{:else if authState.name === 'recovery-sent'}
		<RecoverySentPanel {authState} />
	{:else if authState.name === 'recovery'}
		<RecoveryForm {authState} />
	{/if}
</DemoFrame>
