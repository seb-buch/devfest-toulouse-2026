<script lang="ts">
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
	import CryptoKey from '#lib/components/cryptography/CryptoKey.svelte';
	import Ceremony from '#lib/components/ceremony/Ceremony.svelte';
	import CeremonyStep from '#lib/components/ceremony/CeremonyStep.svelte';
</script>

<Slide>
	<h3>Tout ou rien</h3>

	<Ceremony>
		<CeremonyStep fragmentIndex={0} from="browser" number={1} to="server">
			<span><strong>Nouveau compte</strong> : identifiant · nom · email</span>
		</CeremonyStep>

		<CeremonyStep fragmentIndex={1} from="server" number={2} to="browser">
			<span><strong>Options</strong> : challenge · nouveau <code>user.id</code></span>
			<span class="nothing">Rien en base, à part le challenge</span>
		</CeremonyStep>

		<CeremonyStep fragmentIndex={2} from="authenticator" number={3}>
			<div class="with-key">
				<CryptoKey size="64" type="pair" />
				<strong>Geste utilisateur → nouvelle paire</strong>
			</div>
		</CeremonyStep>

		<CeremonyStep cardAt="between" fragmentIndex={3} from="authenticator" number={4} to="server">
			<div class="with-key">
				<CryptoKey size="64" type="public" />
				<span><strong>Clé publique</strong> · credential ID · challenge · origine</span>
			</div>
		</CeremonyStep>

		<CeremonyStep fragmentIndex={4} from="server" number={5}>
			<strong>Vérifie, puis crée le compte</strong>
			<span class="created">Compte + passkey : une seule transaction</span>
		</CeremonyStep>
	</Ceremony>

	<SpeakerNotes>
		<p>
			C'est la cérémonie d'enregistrement vue tout à l'heure. La différence : il n'y a pas encore de
			compte.
		</p>
		<p>
			[1.] Le navigateur envoie les informations du futur compte. Le serveur vérifie que
			l'identifiant et l'email sont libres.
		</p>
		<p>
			[2.] Il génère le challenge et un nouveau user.id WebAuthn, aléatoire. Il ne crée rien en base
			à part le challenge, qui garde les informations saisies pour la suite.
		</p>
		<p>[3, 4.] Même chose qu'avant : geste, paire de clés, la clé publique part au serveur.</p>
		<p>
			[5.] C'est seulement après vérification que le serveur crée le compte et sa passkey, dans une
			seule transaction. Si j'annule la fenêtre du système, aucun compte n'est créé. Et à aucun
			moment ce compte n'a eu de mot de passe.
		</p>
	</SpeakerNotes>
</Slide>

<style>
	.with-key {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.nothing {
		font-weight: 600;
	}

	.created {
		color: #0b6f78;
		font-weight: 600;
	}
</style>
