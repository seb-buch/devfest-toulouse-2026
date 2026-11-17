<script lang="ts">
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';

	const rows = [
		{
			question: 'Où est la clé privée ?',
			deviceBound: 'Dans un seul authentificateur',
			synced: 'Sur tous les appareils du gestionnaire, synchronisée chiffrée'
		},
		{
			question: 'Si je perds l’appareil ?',
			deviceBound: 'Cette passkey est perdue',
			synced: 'Toujours là sur les autres appareils, ou restaurée'
		},
		{
			question: 'Mon accès dépend…',
			deviceBound: 'd’une autre passkey du compte',
			synced: 'du compte du gestionnaire (Apple, Google, 1Password…)'
		}
	];

	/*  Dernière ligne : flags de authenticatorData, au style de la légende vue plus tôt  */
	const flags = {
		deviceBound: { BE: 0, BS: 0 },
		synced: { BE: 1, BS: 1 }
	};
</script>

<Slide>
	<h3>Annexe&nbsp;: synchronisée ou liée à un appareil&nbsp;?</h3>

	<table>
		<thead>
			<tr>
				<td></td>
				<th scope="col">Liée à un appareil</th>
				<th scope="col">Synchronisée</th>
			</tr>
		</thead>
		<tbody>
			{#each rows as row (row.question)}
				<tr class="fragment">
					<th scope="row">{row.question}</th>
					<td>{row.deviceBound}</td>
					<td>{row.synced}</td>
				</tr>
			{/each}
			<tr class="fragment">
				<th scope="row">Ce que voit le serveur</th>
				{#each [flags.deviceBound, flags.synced] as values, index (index)}
					<td>
						{#each Object.entries(values) as [flag, value] (flag)}
							<span class="flag"><code>{flag}</code>{value}</span>
						{/each}
					</td>
				{/each}
			</tr>
		</tbody>
	</table>

	<SpeakerNotes>
		<p>
			Dans la démo, chaque passkey de la liste affiche « synchronisable » ou « liée à l'appareil ».
			Qu'est-ce que ça change ?
		</p>
		<p>
			[Où.] Une passkey liée à un appareil ne quitte jamais son authentificateur : une clé de
			sécurité, par exemple. Une passkey synchronisée est copiée, chiffrée, sur tous les appareils
			du gestionnaire : iCloud Keychain, Google Password Manager, 1Password…
		</p>
		<p>
			[Perte.] Je perds ma clé de sécurité : cette passkey est perdue. Je perds mon téléphone : ma
			passkey synchronisée est toujours sur mon ordinateur, ou je la restaure sur un nouveau
			téléphone.
		</p>
		<p>
			[Dépendance.] En contrepartie, mon accès dépend de mon compte Apple ou Google, et de sa propre
			récupération.
		</p>
		<p>
			[Ce que voit le serveur.] Le serveur le sait grâce aux flags BE (backup eligible,
			sauvegardable) et BS (backup state, sauvegardée) vus tout à l'heure dans authenticatorData.
			Ils sont relus à chaque connexion : une passkey peut être sauvegardable sans l'être encore (BE
			1, BS 0). Il peut s'en servir, par exemple pour inciter à ajouter une seconde passkey quand la
			seule passkey du compte n'est pas sauvegardée.
		</p>
		<p>
			Attention : authenticatorAttachment (platform / cross-platform) est un autre axe. Il ne dit
			pas si la passkey est synchronisée.
		</p>
		<p>Source : https://fidoalliance.org/passkeys/</p>
	</SpeakerNotes>
</Slide>

<style>
	table {
		width: 1600px;
		margin: 100px auto 0;
		border-collapse: separate;
		border-spacing: 0 18px;
		font-size: 32px;
		text-align: left;
	}

	thead th {
		padding: 0 32px;
		font-family: var(--slyd-headings-font), sans-serif;
		font-size: 40px;
		font-weight: 400;
		text-transform: uppercase;
		color: var(--slyd-headings-color);
	}

	tbody th,
	tbody td {
		padding: 18px 32px;
		background: #fff;
		border-block: 5px solid var(--night-silhouette);
	}

	tbody th {
		width: 380px;
		border-left: 5px solid var(--night-silhouette);
		font-weight: 600;
	}

	tbody td:last-child {
		border-right: 5px solid var(--night-silhouette);
	}

	.flag {
		margin-right: 28px;
		font-family: var(--slyd-code-font), monospace;
		font-weight: 600;

		code {
			margin-right: 10px;
			padding: 0 10px;
			background: var(--sunset-yellow);
		}
	}
</style>
