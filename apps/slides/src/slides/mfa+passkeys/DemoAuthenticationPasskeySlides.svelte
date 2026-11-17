<script lang="ts">
	import { onMount } from 'svelte';
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
	import HybridDemoApp from '#lib/demos/hybrid/HybridDemoApp.svelte';
	import { type Ceremony, getPasskeyDemoState } from '#lib/demos/demo-hybrid.svelte.ts';
	import { authenticationExchange, registrationExchange } from '#lib/demos/ceremony-data.ts';
	import PasskeyOptionsCodeSlide from './PasskeyOptionsCodeSlide.svelte';
	import AddPasskeyCodeSlide from './AddPasskeyCodeSlide.svelte';
	import PasskeyVerificationCodeSlide from './PasskeyVerificationCodeSlide.svelte';
	import RegistrationOptionsSlide from './RegistrationOptionsSlide.svelte';
	import RegistrationResponseSlide from './RegistrationResponseSlide.svelte';
	import LoginOptionsCodeSlide from './LoginOptionsCodeSlide.svelte';
	import AuthenticationOptionsSlide from './AuthenticationOptionsSlide.svelte';
	import LoginCodeSlide from './LoginCodeSlide.svelte';
	import AuthenticationResponseSlide from './AuthenticationResponseSlide.svelte';
	import LoginVerificationCodeSlide from './LoginVerificationCodeSlide.svelte';

	const auth = $derived(getPasskeyDemoState());

	/*  Dernière cérémonie de chaque type, affichée dans les diapos de code (exemple sinon)  */
	let registration: Ceremony | undefined = $state.raw();
	let authentication: Ceremony | undefined = $state.raw();

	function recordCeremony(ceremony: Ceremony) {
		logExample(ceremony);
		if (ceremony.type === 'registration') registration = ceremony;
		else authentication = ceremony;
	}

	/*  Dev uniquement : cérémonie réussie au format JSON, pour régénérer les exemples hors ligne  */
	function logExample({ type, options, credential, error }: Ceremony) {
		if (!import.meta.env.DEV || error) return;
		console.info(`Exemple ${type} :\n${JSON.stringify({ options, credential }, null, '\t')}`);
	}

	onMount(() => {
		if (auth.name === 'initial') void auth.initialize({ onCeremony: recordCeremony });
	});
</script>

<Slide>
	<h3>Une clé de plus au trousseau</h3>
	<div class="demo-stage">
		<HybridDemoApp authState={auth} />
	</div>
	<SpeakerNotes>
		Voilà, donc on va voir comment on peut créer une passkey. Pour ça, on va commencer par se
		connecter à notre application avec mon mot de passe. Voilà. Et là j'arrive sur une page où je
		vais pouvoir donner un nom à une passkey et l'ajouter. Donc on va donner un nom. Cette passkey
		on va l'appeler défaut. Je peux lui donner n'importe quel nom, c'est vraiment juste pour
		l'affichage. J'ajoute cette passkey. Voilà, et là vous voyez que j'ai une pop-up qui va
		s'afficher et qui va me permettre de enregistrer ma clé d'accès dans différents endroits. Là, je
		vais choisir de l'enregistrer dans mon profil Chrome associé à mon navigateur. Je continue. J'ai
		la demande de biométrie qui me permet de m'assurer et de faire que la clé d'accès va être
		associée à mon empreinte digitale et la clé comme vous le voyez a été ajoutée.
	</SpeakerNotes>
</Slide>

<PasskeyOptionsCodeSlide />
<RegistrationOptionsSlide exchange={registrationExchange(registration)} />
<AddPasskeyCodeSlide />
<RegistrationResponseSlide exchange={registrationExchange(registration)} />
<PasskeyVerificationCodeSlide />

<Slide>
	<h3>Sans mot de passe ni code</h3>
	<div class="demo-stage">
		<HybridDemoApp authState={auth} />
	</div>
	<SpeakerNotes>
		Voilà, donc on a fait le tour, on a enregistré une clé d'accès, mais maintenant on va pouvoir
		s'authentifier avec la clé d'accès. Je vais cliquer sur ce bouton et là vous voyez la pop-up du
		navigateur qui me propose d'utiliser la clé d'accès. Je n'ai pas eu à rentrer mon nom
		d'utilisateur puisque ma clé est découvrable. Et donc je vais continuer avec cette clé là. J'ai
		une vérification de l'utilisateur avec la biométrie. Et voilà, je viens d'être connecté sans
		avoir à rentrer ni mon nom d'utilisateur, ni mon mot de passe.
	</SpeakerNotes>
</Slide>

<LoginOptionsCodeSlide />
<AuthenticationOptionsSlide exchange={authenticationExchange(authentication)} />
<LoginCodeSlide />
<AuthenticationResponseSlide exchange={authenticationExchange(authentication)} />
<LoginVerificationCodeSlide />
