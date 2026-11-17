<script lang="ts">
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
	import CryptoKey from '#lib/components/cryptography/CryptoKey.svelte';
	import Ceremony from '#lib/components/ceremony/Ceremony.svelte';
	import CeremonyStep from '#lib/components/ceremony/CeremonyStep.svelte';
	import CeremonyTitle from '#lib/components/ceremony/CeremonyTitle.svelte';
</script>

<Slide>
	<CeremonyTitle
		api="navigator.credentials.get()"
		kind="authentication"
		title="Cérémonie d'authentification"
	/>

	<Ceremony>
		<CeremonyStep fragmentIndex={0} from="server" number={1} to="browser">
			<span><strong>Options</strong> : challenge · RP ID</span>
			<span>credential IDs autorisés (optionnel)</span>
		</CeremonyStep>

		<CeremonyStep fragmentIndex={1} from="browser" number={2} to="authenticator">
			<span><code>get()</code> : RP ID · challenge</span>
			<span class="origin">Vérifie l'origine ↔ RP ID et l'ajoute</span>
		</CeremonyStep>

		<CeremonyStep fragmentIndex={2} from="authenticator" number={3}>
			<div class="with-key">
				<CryptoKey size="64" type="private" />
				<div>
					<strong>Geste utilisateur → signature du challenge</strong>
				</div>
			</div>
		</CeremonyStep>

		<CeremonyStep cardAt="between" fragmentIndex={3} from="authenticator" number={4} to="server">
			<span><strong>Signature</strong> · credential ID · user handle</span>
			<span>challenge · origine</span>
		</CeremonyStep>

		<CeremonyStep fragmentIndex={4} from="server" number={5}>
			<div class="with-key">
				<CryptoKey size="64" type="public" />
				<div>
					<strong>Vérifie la signature du challenge</strong>
					<span>+ origine, RP ID</span>
				</div>
			</div>
		</CeremonyStep>
	</Ceremony>

	<SpeakerNotes>
		De la même façon, pour l'authentification, on va avoir une cérémonie d'authentification qui va
		être très proche en termes de fonctionnement, puisque comme pour la cérémonie précédente, le
		serveur va commencer par envoyer les options d'authentification avec un challenge, ses
		identifiants et les credentials autorisés. Ça c'est optionnel, on reviendra là-dessus un peu
		plus tard. Le navigateur va utiliser encore une fois l'API définie dans les spécifications qui
		est cette fois-ci navigator.credentials.get qui va permettre de récupérer la clé depuis
		l'authentificateur pour la renvoyer au serveur. Et pour ça, il va donner, il va envoyer avec
		cette API les options passées par le serveur à l'authentificateur. Cet authentificateur va
		encore demander un geste utilisateur pour vérifier sa présence et qu'il est le bon utilisateur
		et va renvoyer la signature du challenge que le navigateur va renvoyer avec les deux autres
		informations complémentaires au serveur. Le serveur, lui, va vérifier la signature du challenge.
		que la réponse renvoyée par le navigateur correspond bien à ce qu'il attendait et si c'est bon
		va valider l'authentification.
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
</style>
