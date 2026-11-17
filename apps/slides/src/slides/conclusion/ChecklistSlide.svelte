<script lang="ts">
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';

	const groups = [
		{
			name: 'Enregistrement',
			items: [
				'RP ID : un domaine stable, enregistrable',
				"residentKey: 'required', userVerification: 'preferred'",
				"attestation: 'none'",
				'excludeCredentials à chaque ajout',
				'Un seul user.id WebAuthn par compte'
			]
		},
		{
			name: 'Connexion',
			items: [
				'Autocomplétion + bouton',
				'Passkey du bon compte + userHandle vérifiés',
				'Faux credential pour un identifiant inconnu'
			]
		},
		{
			name: 'Gestion',
			items: ['Plusieurs passkeys, nommées', 'Jamais de suppression de la dernière']
		},
		{
			name: 'Récupération',
			items: ['Le lien crée une passkey, il ne connecte pas', 'Aussi solide que la passkey']
		}
	];
</script>

<Slide>
	<h3>Annexe&nbsp;: codes de triche</h3>

	<div class="groups">
		{#each groups as group (group.name)}
			<section>
				<h4>{group.name}</h4>
				<ul>
					{#each group.items as item (item)}
						<li>{item}</li>
					{/each}
				</ul>
			</section>
		{/each}
	</div>

	<SpeakerNotes>
		<p>
			Si vous ne deviez prendre qu'une photo, c'est celle-là : tout ce qu'on a vu pendant le talk,
			sur une diapo.
		</p>
		<p>
			[Enregistrement.] Le RP ID, choisi pour longtemps. Une passkey découvrable, la vérification
			utilisateur préférée. Pas d'attestation : en grand public, on accepte tous les appareils. Pas
			de doublon grâce à excludeCredentials. Et un user.id WebAuthn unique par compte, réutilisé à
			chaque ajout.
		</p>
		<p>
			[Connexion.] L'autocomplétion pour l'usage courant, le bouton en secours. Côté serveur, on
			vérifie que la passkey appartient au bon compte. Et on ne révèle pas quels comptes existent.
		</p>
		<p>
			[Gestion.] Plusieurs passkeys, avec un nom pour les reconnaître. Jamais de compte sans
			passkey.
		</p>
		<p>[Récupération.] Elle contourne la passkey : elle doit être aussi solide qu'elle.</p>
	</SpeakerNotes>
</Slide>

<style>
	.groups {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 40px 64px;
		margin: 50px 40px 0;
		text-align: left;

		section {
			padding: 16px 32px 20px;
			border: 6px solid var(--night-silhouette);
			box-shadow: 10px 12px 0 var(--night-silhouette);
			background: #fff;

			&:nth-child(odd) {
				rotate: -0.6deg;
			}

			&:nth-child(even) {
				rotate: 0.6deg;
			}
		}
	}

	h4 {
		margin: 0 0 8px;
		font-family: var(--slyd-headings-font), sans-serif;
		font-size: 36px;
		font-weight: 400;
		text-transform: uppercase;
		color: var(--slyd-headings-color);
	}

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
		font-size: 27px;
		line-height: 1.5;

		li::before {
			content: '✓';
			display: inline-block;
			width: 1.4em;
			font-weight: 700;
			color: #0b6f78;
		}
	}
</style>
