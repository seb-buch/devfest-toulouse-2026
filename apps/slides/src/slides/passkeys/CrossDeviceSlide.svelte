<script lang="ts">
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
	import CryptoKey from '#lib/components/cryptography/CryptoKey.svelte';
	import Ceremony from '#lib/components/ceremony/Ceremony.svelte';
	import CeremonyStep from '#lib/components/ceremony/CeremonyStep.svelte';
</script>

<Slide>
	<h3>Le téléphone en renfort</h3>

	<Ceremony>
		<CeremonyStep fragmentIndex={0} from="server" number={1} to="browser">
			<span><strong>Options</strong> : challenge · RP ID</span>
		</CeremonyStep>

		<CeremonyStep fragmentIndex={1} from="browser" number={2} to="authenticator">
			<span><strong>QR code</strong> scanné par le téléphone</span>
			<span class="detail">Bluetooth : le téléphone est-il à côté&nbsp;?</span>
		</CeremonyStep>

		<CeremonyStep fragmentIndex={2} from="authenticator" number={3}>
			<div class="with-key">
				<CryptoKey size="64" type="private" />
				<div>
					<strong>Geste sur le téléphone → signature</strong>
					<span class="detail">La clé privée ne quitte pas le téléphone</span>
				</div>
			</div>
		</CeremonyStep>

		<CeremonyStep cardAt="between" fragmentIndex={3} from="authenticator" number={4} to="browser">
			<span><strong>Signature</strong> via un tunnel chiffré</span>
		</CeremonyStep>

		<CeremonyStep fragmentIndex={4} from="browser" number={5} to="server">
			<span><strong>Réponse</strong> vérifiée → session ouverte</span>
		</CeremonyStep>
	</Ceremony>

	<SpeakerNotes>
		<p>
			[Montré pendant la démo de gestion.] J'ai ajouté une passkey sur mon téléphone, puis je me
			suis connecté sur l'ordinateur avec. Comment ça marche ? Pour le site, rien ne change : mêmes
			options, même vérification.
		</p>
		<p>
			[2.] Le navigateur affiche un QR code. Le téléphone le scanne, et le Bluetooth sert à vérifier
			qu'il est physiquement à côté : un QR code envoyé par un attaquant ne marche pas à distance.
		</p>
		<p>
			[3, 4.] Le téléphone signe le challenge après mon geste. La signature revient au navigateur
			par un tunnel chiffré, qui peut passer par un relais sur Internet. Rien ne passe en clair par
			le Bluetooth.
		</p>
		<p>
			[5.] Le navigateur transmet la réponse comme d'habitude. La passkey n'est pas copiée sur
			l'ordinateur : ce n'est pas de la synchronisation. C'est le transport « hybrid » de la
			spécification (CTAP 2.2).
		</p>
		<p>
			Préparation : Bluetooth activé sur les deux appareils, téléphone et ordinateur sur un réseau
			qui laisse passer le relais.
		</p>
		<p>Source : https://passkeys.dev/docs/reference/terms/#hybrid</p>
	</SpeakerNotes>
</Slide>

<style>
	.with-key {
		display: flex;
		align-items: center;
		gap: 12px;

		div {
			display: flex;
			flex-direction: column;
		}
	}

	.detail {
		font-weight: 600;
	}
</style>
