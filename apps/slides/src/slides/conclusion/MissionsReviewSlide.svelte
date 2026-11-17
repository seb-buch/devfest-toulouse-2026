<script lang="ts">
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
</script>

<Slide>
	<h3>Bilan&nbsp;: qui résiste à quoi&nbsp;?</h3>

	<!-- La colonne « Mot de passe + TOTP » est affichée d'emblée, les deux suivantes en fragments -->
	<table>
		<thead>
			<tr>
				<td></td>
				<th scope="col">Mot de passe + TOTP</th>
				<th scope="col" class="fragment custom" data-fragment-index="0">Hybride</th>
				<th scope="col" class="fragment custom" data-fragment-index="1">100 % passkeys</th>
			</tr>
		</thead>
		<tbody>
			<tr style="--row: 0">
				<th scope="row">Phishing</th>
				<td><span class="mark bad" aria-hidden="true">✕</span> Code TOTP rejouable</td>
				<td class="fragment custom" data-fragment-index="0">
					<span class="mark bad" aria-hidden="true">✕</span> Par le mot de passe
				</td>
				<td class="fragment custom" data-fragment-index="1">
					<span class="mark good" aria-hidden="true">✓</span> Signature liée au site
				</td>
			</tr>
			<tr style="--row: 1">
				<th scope="row">Fuite de la base</th>
				<td><span class="mark bad" aria-hidden="true">✕</span> Hash + secret TOTP</td>
				<td class="fragment custom" data-fragment-index="0">
					<span class="mark bad" aria-hidden="true">✕</span> Toujours là
				</td>
				<td class="fragment custom" data-fragment-index="1">
					<span class="mark good" aria-hidden="true">✓</span> Clés publiques
				</td>
			</tr>
			<tr style="--row: 2">
				<th scope="row">Nouvel appareil</th>
				<td><span class="mark mixed" aria-hidden="true">~</span> Mémoire + app TOTP</td>
				<td class="fragment custom" data-fragment-index="0">
					<span class="mark good" aria-hidden="true">✓</span> Au choix
				</td>
				<td class="fragment custom" data-fragment-index="1">
					<span class="mark mixed" aria-hidden="true">~</span> Synchro ou téléphone
				</td>
			</tr>
			<tr style="--row: 3">
				<th scope="row">Récupération</th>
				<td><span class="mark mixed" aria-hidden="true">~</span> Mot de passe oublié</td>
				<td class="fragment custom" data-fragment-index="0">
					<span class="mark mixed" aria-hidden="true">~</span> Deux parcours à protéger
				</td>
				<td class="fragment custom" data-fragment-index="1">
					<span class="mark mixed" aria-hidden="true">~</span> Email → nouvelle passkey
				</td>
			</tr>
		</tbody>
	</table>

	<SpeakerNotes>
		<p>Faisons le bilan des trois apps qu'on a vues tourner.</p>
		<p>
			[Mot de passe + TOTP.] Le TOTP ajoute une vérification, mais un faux site peut relayer le code
			en temps réel. Et la base contient le hash du mot de passe et le secret TOTP, en clair ou
			chiffré de façon réversible. Sur un nouvel appareil : il faut se souvenir du mot de passe et
			avoir l'app TOTP.
		</p>
		<p>
			[Hybride.] La passkey apporte la résistance au phishing… pour ceux qui l'utilisent. Le mot de
			passe est toujours là : l'attaquant passe par là. Deux parcours à protéger.
		</p>
		<p>
			[100 % passkeys.] Plus de secret partagé : rien à hameçonner, rien à casser dans la base. La
			contrepartie : la disponibilité des passkeys, et une récupération à soigner.
		</p>
		<p>Aucune colonne n'est parfaite. Mais la dernière déplace le risque au bon endroit.</p>
	</SpeakerNotes>
</Slide>

<style>
	table {
		width: 1700px;
		margin: 60px auto 0;
		border-collapse: separate;
		border-spacing: 0 14px;
		font-size: 30px;
		text-align: left;
	}

	thead th {
		padding: 0 24px;
		font-family: var(--slyd-headings-font), sans-serif;
		font-size: 40px;
		font-weight: 400;
		text-align: center;
		text-transform: uppercase;
		color: var(--slyd-headings-color);
	}

	tbody th,
	tbody td {
		padding: 16px 24px;
		background: #fff;
		border-block: 5px solid var(--night-silhouette);
	}

	tbody th {
		width: 300px;
		border-inline: 5px solid var(--night-silhouette);
		font-weight: 600;
	}

	/*  Chaque cellule a son cadre complet : le tableau est fermé à chaque étape  */
	tbody td {
		border-right: 5px solid var(--night-silhouette);
	}

	/*  Colonnes « dessinées » de gauche à droite, une ligne après l'autre  */
	.fragment {
		clip-path: inset(0 100% 0 0);
		transition: clip-path 0.4s ease-out;

		&:global(.revealed) {
			clip-path: inset(0);
		}
	}

	tbody .fragment {
		transition-delay: calc(var(--row) * 80ms);
	}

	.mark {
		display: inline-grid;
		place-items: center;
		width: 44px;
		height: 44px;
		margin-right: 12px;
		border: 4px solid var(--night-silhouette);
		border-radius: 50%;
		font-weight: 700;
		vertical-align: middle;

		&.good {
			background: var(--vice-teal);
		}

		&.bad {
			color: #fff;
			background: var(--slyd-accent-color);
		}

		&.mixed {
			background: var(--sunset-yellow);
		}
	}
</style>
