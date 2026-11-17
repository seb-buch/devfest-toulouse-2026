<script lang="ts">
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
	import CryptoKey from '#lib/components/cryptography/CryptoKey.svelte';
	import Ceremony from '#lib/components/ceremony/Ceremony.svelte';
	import CeremonyStep from '#lib/components/ceremony/CeremonyStep.svelte';
	import CeremonyTitle from '#lib/components/ceremony/CeremonyTitle.svelte';
</script>

<Slide>
	<CeremonyTitle
		api="navigator.credentials.create()"
		kind="registration"
		title="Cérémonie d'enregistrement"
	/>

	<Ceremony>
		<CeremonyStep fragmentIndex={0} from="server" number={1} to="browser">
			<span><strong>Options</strong> : challenge · RP ID · utilisateur</span>
		</CeremonyStep>

		<CeremonyStep fragmentIndex={1} from="browser" number={2} to="authenticator">
			<span><code>create()</code> : RP ID · utilisateur · challenge</span>
			<span class="origin">Vérifie l'origine ↔ RP ID et l'ajoute</span>
		</CeremonyStep>

		<CeremonyStep fragmentIndex={2} from="authenticator" number={3}>
			<div class="with-key">
				<CryptoKey size="64" type="pair" />
				<div>
					<strong>Geste utilisateur → nouvelle paire</strong>
				</div>
			</div>
		</CeremonyStep>

		<CeremonyStep cardAt="between" fragmentIndex={3} from="authenticator" number={4} to="server">
			<div class="with-key">
				<CryptoKey size="64" type="public" />
				<span><strong>Clé publique</strong> · credential ID · challenge · origine</span>
			</div>
		</CeremonyStep>

		<CeremonyStep fragmentIndex={4} from="server" number={5}>
			<strong>Vérifie challenge, origine, RP ID</strong>
			<span class="public">Stocke la clé publique sur le compte</span>
		</CeremonyStep>
	</Ceremony>

	<SpeakerNotes>
		Dans la spécification, il y a aussi deux cérémonies qui sont décrites. La première, c'est la
		cérémonie d'enregistrement, qui, comme son nom l'indique, correspond à l'enregistrement de la
		clé d'accès par l'authentificateur et le serveur. Donc la cérémonie est décrite de la façon
		suivante. On va avoir des options d'enregistrement qui vont être envoyées du serveur vers le
		navigateur avec en plus un challenge qui va correspondre dans notre exemple avec Alice et Bob ou
		documents que Bob envoyait à Alice. Ce challenge est envoyé du serveur vers le navigateur avec
		en plus ses identifiants et l'utilisateur en question. Et le navigateur va utiliser une API
		définie par WebAuthn, qui est le navigator.credentials.create, et elle va passer les options
		envoyées par le serveur. à l'authentificateur pour lui demander la création des clés d'accès.
		Cet authentificateur va créer la paire de clés privées et publiques nécessaires à la création de
		la clé d'accès et va aussi demander un geste utilisateur pour demander sa présence ou sa
		vérification. Et va renvoyer au navigateur la clé publique et les informations nécessaires
		associées. Le navigateur renvoie cette réponse au serveur qui va vérifier ce que le navigateur
		lui renvoie et va stocker la clé publique pour le compte.
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

	.origin {
		font-weight: 600;
	}

	.public {
		color: #0b6f78;
		font-weight: 600;
	}
</style>
