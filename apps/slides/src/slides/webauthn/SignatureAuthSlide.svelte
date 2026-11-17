<script lang="ts">
	import { Slide, SpeakerNotes, VerticalSpacer } from '@seb-buch/slyd';
	import CryptoKey from '#lib/components/cryptography/CryptoKey.svelte';
	import Document from '#lib/components/cryptography/Document.svelte';
	import IdCard from '#lib/components/cryptography/IdCard.svelte';
	import bob from '#lib/assets/slides/bob.webp';
	import alice from '#lib/assets/slides/alice.webp';
</script>

{#snippet gpsArrow(fragmentIndex: number)}
	<svg class="gps-arrow" viewBox="0 0 260 40" aria-hidden="true">
		<path
			class="fragment custom"
			data-fragment-index={fragmentIndex}
			d="M 10 20 H 244 M 226 6 L 246 20 L 226 34"
			pathLength="1"
		/>
	</svg>
{/snippet}

<Slide>
	<h3>S'authentifier par une signature</h3>

	<VerticalSpacer height="2em" />

	<div class="stage">
		<div class="row">
			<div class="person">
				<IdCard name="Alice" photo={alice} />
				<div class="key-slot">
					<CryptoKey size="110" type="pair" />
				</div>
			</div>
			<div class="mover challenge fragment custom" data-fragment-index="0">
				<Document />
			</div>
			<div class="action">
				<div class="mover sign-key fragment" data-fragment-index="1">
					<CryptoKey size="130" type="private" />
				</div>
				{@render gpsArrow(1)}
				<p class="fragment" data-fragment-index="1">
					<strong>Signature</strong><span class="private">clé privée</span>
				</p>
			</div>
			<div class="result fragment" data-fragment-index="2">
				<Document state="signed" />
			</div>
		</div>

		<VerticalSpacer height="70px" />

		<div class="row">
			<div class="person">
				<IdCard name="Bob" photo={bob} />
				<div class="key-slot">
					<div class="mover received-key fragment" data-fragment-index="3">
						<CryptoKey size="110" type="public" />
					</div>
				</div>
			</div>
			<div class="mover signed-delivery fragment" data-fragment-index="3">
				<Document state="signed" />
			</div>
			<div class="action">
				<div class="mover verify-key fragment" data-fragment-index="4">
					<CryptoKey size="130" type="public" />
				</div>
				{@render gpsArrow(4)}
				<p class="fragment" data-fragment-index="4">
					<strong>Vérification</strong><span class="public">clé publique</span>
				</p>
			</div>
			<div class="result fragment" data-fragment-index="5">
				<Document state="verified" />
			</div>
		</div>
	</div>

	<p class="conclusion fragment" data-fragment-index="6">
		Bob a authentifié Alice <em>sans</em> partager de secret&nbsp;!
	</p>

	<SpeakerNotes>
		Pour mieux comprendre comment on va pouvoir utiliser cette paire de clés pour authentifier
		quelqu'un, on va prendre l'exemple d'Alice et Bob, tout simplement. Bob a un document qu'il va
		envoyer à Alice pour qu'elle le signe. Alice va prendre sa clé privée et signer le document. Une
		fois que le document est signé, elle va le retransmettre à Bob. qui va aussi avoir accès à la
		clé publique d'Alice. Et cette clé publique va pouvoir être utilisée par Bob pour vérifier la
		signature du document qu'il a envoyé à Alice. Une fois que le document est vérifié, Bob a la
		certitude qu'Alice a bien signé le document. Une autre façon de voir les choses, c'est de dire
		que Bob a authentifié Alice sans partager de secrets.
	</SpeakerNotes>
</Slide>

<style>
	/*
   * Grille fixe : les déplacements sont des translations exactes entre colonnes et lignes.
   * Colonnes : personne 320, document 170, action 260, résultat 170 (gap 90) ; lignes 300 séparées de 70.
   */
	.stage {
		--row-pitch: 370px;
		--to-result: 610px;
		--key-dx: -630px;
		--key-dy: 145px;

		display: flex;
		flex-direction: column;
	}

	.row {
		display: grid;
		grid-template-columns: 320px 170px 260px 170px;
		column-gap: 90px;
		justify-content: center;
		align-items: center;
		height: 300px;
	}

	.person {
		display: flex;
		flex-direction: column;
		align-items: center;
		rotate: -2deg;
	}

	.row:nth-child(2) .person {
		rotate: 1.5deg;
	}

	.key-slot {
		display: grid;
		place-items: center;
		height: 110px;
	}

	/*  Trajets : chaque élément part d'ailleurs et rejoint sa place à la révélation  */
	.row .mover {
		transition: translate 1s ease-in-out;

		&:global(.revealed) {
			translate: 0 0;
		}
	}

	/*  Le message part de chez Bob et monte chez Alice  */
	.challenge {
		translate: 0 var(--row-pitch);
	}

	/*  Les clés quittent le trousseau pour l'action  */
	.sign-key,
	.verify-key {
		translate: var(--key-dx) var(--key-dy);
	}

	/*  La clé publique de Alice descend chez Bob  */
	.received-key {
		translate: 0 calc(-1 * var(--row-pitch));
	}

	/*  Le document signé redescend chez Bob  */
	.signed-delivery {
		translate: var(--to-result) calc(-1 * var(--row-pitch));
	}

	.action {
		display: flex;
		flex-direction: column;
		align-items: center;

		p {
			display: flex;
			flex-direction: column;
			align-items: center;
			margin: 0;
			line-height: 1.15;
			/*  Le libellé arrive avec la flèche, une fois la clé en place  */
			opacity: 0;
			transition: opacity 0.3s ease 0.9s;

			&:global(.revealed) {
				opacity: 1;
			}

			strong {
				font-family: var(--slyd-headings-font), sans-serif;
				font-weight: 400;
				font-size: 40px;
				text-transform: uppercase;
			}

			span {
				font-size: 26px;
				font-weight: 600;
			}

			.private {
				color: var(--slyd-headings-color);
			}

			.public {
				color: #0b6f78;
			}
		}
	}

	/*  Flèche GPS : tracée au moment de l'action  */
	.gps-arrow {
		width: 260px;
		height: 40px;
		margin: 4px 0;
		overflow: visible;

		path {
			fill: none;
			stroke: var(--sunset-pink);
			stroke-width: 9;
			stroke-linecap: round;
			stroke-linejoin: round;
			stroke-dasharray: 1 1;
			stroke-dashoffset: 1;
			visibility: hidden;
			transition: stroke-dashoffset 0.6s ease-in-out 0.8s;

			&:global(.revealed) {
				visibility: visible;
				stroke-dashoffset: 0;
			}
		}
	}

	/*  Résultat : le document « poppe », puis le tampon s'écrase dessus  */
	.result {
		scale: 0.6;
		transition: scale 0.35s cubic-bezier(0.2, 1.6, 0.4, 1);

		:global(.stamp) {
			scale: 2.4;
			opacity: 0;
			transition:
				scale 0.25s ease-in 0.35s,
				opacity 0.1s linear 0.35s;
		}

		&:global(.revealed) {
			scale: 1;

			:global(.stamp) {
				scale: 1;
				opacity: 1;
			}
		}
	}

	/*  Conclusion : bandeau de fin de mission  */
	.conclusion {
		position: absolute;
		left: 50%;
		bottom: 64px;
		margin: 0;
		padding: 6px 36px;
		translate: -50% 0;
		rotate: -1.5deg;
		border: 6px solid var(--night-silhouette);
		box-shadow: 12px 14px 0 var(--night-silhouette);
		background: var(--sunset-yellow);
		font-family: var(--slyd-headings-font), sans-serif;
		font-size: 48px;
		text-transform: uppercase;
		white-space: nowrap;
		scale: 0.6;
		transition: scale 0.35s cubic-bezier(0.2, 1.6, 0.4, 1);

		&:global(.revealed) {
			scale: 1;
		}

		em {
			font-style: normal;
			color: var(--slyd-headings-color);
			text-decoration: underline 5px;
			text-underline-offset: 6px;
		}
	}
</style>
