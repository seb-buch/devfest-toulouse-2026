<script lang="ts">
	import PasskeysSectionTitle from './passkeys/PasskeysSectionTitle.svelte';
	import PasskeysDemoSlide from './passkeys/PasskeysDemoSlide.svelte';
	import AccountCreationSlide from './passkeys/AccountCreationSlide.svelte';
	import CrossDeviceSlide from './passkeys/CrossDeviceSlide.svelte';
	import LostPasskeysSlide from './passkeys/LostPasskeysSlide.svelte';
	import DomainsSlide from './passkeys/DomainsSlide.svelte';
	import PasskeysConclusionSlide from './passkeys/PasskeysConclusionSlide.svelte';
	import MapTransitionSlide from '#lib/components/map/MapTransitionSlide.svelte';
</script>

<MapTransitionSlide route="to-mission-4" />
<PasskeysSectionTitle />

<PasskeysDemoSlide title="Né avec une passkey">
	{#snippet notes()}
		<p>
			Nouvelle app, nouveau compte. [Créer un compte.] Identifiant, nom, email, et le nom de ma
			première passkey. Aucun champ mot de passe.
		</p>
		<p>
			[Créer le compte.] La fenêtre du système s'ouvre, je choisis mon gestionnaire, je valide avec
			mon empreinte. Je suis connecté directement : la création de la passkey a prouvé que c'est
			moi.
		</p>
	{/snippet}
</PasskeysDemoSlide>

<AccountCreationSlide />

<PasskeysDemoSlide title="Gérer son trousseau">
	{#snippet notes()}
		<p>
			[Se connecter.] Une seule passkey : le bouton Supprimer est désactivé. Supprimer la dernière
			passkey, c'est perdre le compte.
		</p>
		<p>
			[Ajouter « Téléphone », choisir « Un autre appareil » dans la fenêtre système, scanner le QR
			code.] La passkey est créée sur mon téléphone. Même user.id WebAuthn que le compte, et
			excludeCredentials : impossible d'en créer une seconde sur le même gestionnaire.
		</p>
		<p>
			[Se déconnecter, se connecter avec le téléphone via le QR code.] Je me connecte sur
			l'ordinateur avec la passkey du téléphone.
		</p>
		<p>
			[Supprimer la passkey « Ordinateur ».] Supprimée côté serveur, mais mon gestionnaire peut
			continuer à me la proposer. Il existe une API pour le prévenir, la Signal API : l'app
			l'appelle, mais le support est encore partiel, et c'est le gestionnaire qui décide.
		</p>
		<p>
			Préparation : Bluetooth activé, téléphone déverrouillé. Le gestionnaire du téléphone doit être
			distinct de celui de l'ordinateur, sinon excludeCredentials refuse l'ajout.
		</p>
	{/snippet}
</PasskeysDemoSlide>

<CrossDeviceSlide />
<LostPasskeysSlide />

<PasskeysDemoSlide title="Le double des clés" recovery>
	{#snippet notes()}
		<p>
			[Se déconnecter, Passkeys perdues ?] Je fais comme si j'avais perdu ma passkey. Je donne mon
			email. [Recevoir un lien.] La réponse est la même que le compte existe ou non.
		</p>
		<p>
			[Ouvrir Mailpit, ouvrir l'email.] L'email contient un lien valable 15 minutes, une seule fois.
			[Cliquer le lien : la présentation s'ouvre sur cette diapo.] Il ne me connecte pas : il me
			propose de créer une nouvelle passkey.
		</p>
		<p>
			[Nommer la passkey, Créer.] Nouvelle passkey, et c'est seulement maintenant que la session
			s'ouvre. Le lien est consommé : le rouvrir ne mènerait plus nulle part.
		</p>
		<p>
			Contrepartie : ce lien contourne la passkey. La sécurité du compte dépend maintenant de celle
			de la boîte mail. On prévient l'utilisateur de chaque récupération ; pour un compte sensible,
			on peut exiger plus (vérification d'identité, délai, support).
		</p>
		<p>
			Préparation : créer la passkey de récupération sur un autre authentificateur (clé de sécurité,
			ou supprimer d'abord la passkey du gestionnaire), sinon excludeCredentials la refuse.
		</p>
	{/snippet}
</PasskeysDemoSlide>

<DomainsSlide />
<PasskeysConclusionSlide />
