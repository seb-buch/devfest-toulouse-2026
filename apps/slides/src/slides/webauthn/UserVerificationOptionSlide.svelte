<script lang="ts">
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
	import MiniCeremony from '#lib/components/options/MiniCeremony.svelte';
	import OptionCard from '#lib/components/options/OptionCard.svelte';
</script>

<Slide>
	<h3>Quel geste utilisateur&nbsp;?</h3>

	<div class="layout">
		<!--  Le geste produit les flags UP / UV, envoyés au serveur dans la réponse  -->
		<div class="minis">
			<MiniCeremony
				highlight={[3, 4]}
				kind="registration"
				labels={{ 3: 'Geste → UP / UV', 4: 'Clé publique + flags UP · UV' }}
			/>
			<MiniCeremony
				highlight={[3, 4]}
				kind="authentication"
				labels={{ 3: 'Geste → UP / UV', 4: 'Signature + flags UP · UV' }}
			/>
		</div>

		<div class="details">
			<OptionCard
				moment="Aux deux cérémonies"
				name="userVerification"
				values={[
					{ value: 'required', label: 'vérification obligatoire, sinon échec' },
					{ value: 'preferred', label: 'vérification si possible', chosen: true },
					{ value: 'discouraged', label: 'éviter la vérification' }
				]}
			/>

			<!--  Présence et vérification : deux flags dans la réponse de l'authentificateur  -->
			<div class="flags fragment" data-fragment-index="0">
				<p class="title">Deux flags dans la réponse</p>
				<dl>
					<div>
						<dt>Présence <code>UP</code></dt>
						<dd>Un humain est là&nbsp;: toucher la clé</dd>
						<span class="status fixed">
							<!--  Cadenas : l'option n'y touche pas  -->
							<svg aria-hidden="true" viewBox="0 0 100 100">
								<path d="M 34 46 V 32 A 16 16 0 0 1 66 32 V 46" />
								<rect height="40" rx="6" width="56" x="22" y="46" />
							</svg>
							Nécessaire
						</span>
					</div>
					<div class="uv">
						<dt>Vérification <code>UV</code></dt>
						<dd>C'est le bon humain&nbsp;: biométrie</dd>
						<span class="status option">
							<!--  Curseurs : c'est ce que règle l'option  -->
							<svg aria-hidden="true" viewBox="0 0 100 100">
								<path d="M 12 32 H 88 M 12 68 H 88" />
								<circle cx="36" cy="32" r="11" />
								<circle cx="64" cy="68" r="11" />
							</svg>
							Option
						</span>
					</div>
				</dl>
			</div>
		</div>
	</div>

	<SpeakerNotes>
		On passe à l'option suivante. Je parlais tout à l'heure de geste utilisateur demandé par
		l'authentificateur. Et ça, il y a une option associée à ça et qui est valable pour les deux
		cérémonies, qui est l'option dont le nom est User Verification et qui peut être là encore soit
		demandée de manière obligatoire. ou demandière préférentielle ou carrément éviter. Les
		recommandations faites par W3C demandent à ce que ce soit une vérification préférentielle,
		c'est-à-dire si c'est possible, on va vérifier que l'utilisateur est bien celui qu'il prétend
		être, sinon on va se contenter simplement de faire la vérification de sa présence. Cet aspect-là
		en fait va se traduire au niveau de la réponse par deux flags. Un flag qu'on appelle UP qui va
		être la présence de l'utilisateur, est-ce que j'ai un humain qui est là et qui a touché le
		bouton pour dire c'est bien un humain ? Donc ça c'est nécessaire dans la très vaste majorité des
		cas. Il y a un autre flag qui est celui associé à l'option qui est UV pour User Verification qui
		va cette fois-ci non pas vérifier qu'un humain est présent mais que c'est le bon humain. Et donc
		typiquement ça va être par de la biométrie, par rentrer un code PIN, quelque chose qui permet de
		dire que l'humain à qui appartient la clé d'accès est bien celui qui est présent au moment de
		l'authentification. ou de l'enregistrement d'ailleurs.
	</SpeakerNotes>
</Slide>

<style>
	/*  Même disposition que les autres options : miniatures à gauche, option à droite  */
	.layout {
		display: flex;
		align-items: center;
		justify-content: space-around;
		margin-top: 1em;
	}

	.minis {
		display: flex;
		flex-direction: column;
		gap: 2em;
	}

	.details {
		display: flex;
		flex-direction: column;
		gap: 48px;
	}

	/*  Fiche UP / UV : cartouche blanc, la vérification mise en avant  */
	.flags {
		width: 900px;
		box-sizing: border-box;
		padding: 24px;
		border: 6px solid var(--night-silhouette);
		box-shadow: 10px 12px 0 var(--night-silhouette);
		background: #fff;
		font-size: 26px;

		.title {
			margin: 0 0 8px;
			font-family: var(--slyd-headings-font), sans-serif;
			font-size: 30px;
			text-transform: uppercase;
			color: var(--slyd-headings-color);
		}

		dl {
			margin: 0;
		}

		dl div {
			padding-top: 0.5em;
			display: flex;
			gap: 16px;
			align-items: center;
		}

		dt {
			min-width: 6.5em;
			font-family: var(--slyd-headings-font), sans-serif;
			font-size: 32px;
			text-transform: uppercase;

			code {
				font-family: var(--slyd-code-font), monospace;
				font-size: 24px;
			}
		}

		dd {
			margin: 0;
		}

		.uv dt {
			color: var(--slyd-headings-color);
		}

		/*  Pastille de statut : fixe (UP) ou réglée par l'option (UV)  */

		.status {
			display: inline-flex;
			align-items: center;
			gap: 6px;
			margin-left: auto;
			padding: 2px 12px 2px 8px;
			border: 3px solid var(--night-silhouette);
			border-radius: 20px;
			font-family: var(--slyd-headings-font), sans-serif;
			font-size: 24px;
			text-transform: uppercase;
			white-space: nowrap;

			svg {
				width: 24px;
				height: 24px;
				fill: #fff;
				stroke: var(--night-silhouette);
				stroke-width: 10;
				stroke-linecap: round;
				stroke-linejoin: round;
			}

			&.fixed {
				background: #d8d2e8;
			}

			&.option {
				background: var(--sunset-yellow);
			}
		}

		dl div + div {
			margin-top: 12px;
		}
	}
</style>
