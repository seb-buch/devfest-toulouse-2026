<script lang="ts">
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
	import CryptoKey from '#lib/components/cryptography/CryptoKey.svelte';
	import ActorArtwork from '#lib/components/actors/ActorArtwork.svelte';
</script>

<Slide>
	<h3>FIDO2</h3>
	<p class="acronym">
		<strong>F</strong>ast <strong>ID</strong>entity <strong>O</strong>nline
	</p>

	<div class="stage">
		<!--  Les trois acteurs, reliés par leurs itinéraires  -->
		<div class="actors">
			<figure class="actor authenticator">
				<ActorArtwork actor="authenticator">
					<div class="key-badge">
						<CryptoKey size="90" type="private" />
					</div>
				</ActorArtwork>
				<figcaption><strong>Authentificateur</strong><span>Clé privée</span></figcaption>
			</figure>

			<!--  Itinéraire CTAP : étiquette et flèche GPS  -->
			<div class="route ctap fragment custom" data-fragment-index="0">
				<span class="label">CTAP</span>
				<svg aria-hidden="true" viewBox="0 0 200 50">
					<path d="M 12 25 H 188 M 32 5 L 10 25 L 32 45 M 168 5 L 190 25 L 168 45" pathLength="1" />
				</svg>
			</div>

			<figure class="actor browser">
				<ActorArtwork actor="browser" />
				<figcaption><strong>Navigateur</strong><span>Client RP</span></figcaption>
			</figure>

			<!--  Itinéraire WebAuthn : étiquette et flèche GPS  -->
			<div class="route webauthn fragment custom" data-fragment-index="1">
				<span class="label">WebAuthn</span>
				<svg aria-hidden="true" viewBox="0 0 200 50">
					<path d="M 12 25 H 188 M 32 5 L 10 25 L 32 45 M 168 5 L 190 25 L 168 45" pathLength="1" />
				</svg>
			</div>

			<figure class="actor server">
				<ActorArtwork actor="server">
					<div class="key-badge">
						<CryptoKey size="90" type="public" />
					</div>
				</ActorArtwork>
				<figcaption><strong>Serveur</strong><span>Relying Party (RP)</span></figcaption>
			</figure>
		</div>

		<!--  Fiches protocole, sous leur itinéraire  -->
		<div class="protocols">
			<section class="protocol ctap fragment custom" data-fragment-index="0">
				<h4>
					<strong>C</strong>lient <strong>T</strong>o <strong>A</strong>uthenticator
					<strong>P</strong>rotocol
				</h4>
				<p>Navigateur / OS ↔ authentificateur</p>
				<span class="stamp">FIDO Alliance</span>
			</section>
			<section class="protocol webauthn fragment custom" data-fragment-index="1">
				<h4>Web Authentication</h4>
				<p>API JavaScript du navigateur</p>
				<span class="stamp">W3C</span>
				<!--  Dernier clic : focus sur WebAuthn  -->
				<span aria-hidden="true" class="focus fragment custom" data-fragment-index="2"></span>
			</section>
		</div>
	</div>

	<SpeakerNotes>
		Ce mécanisme d'authentification par signature est à la base de la spécification Fast Identity
		Online et en particulier la deuxième version, Fido 2, qui fait intervenir trois acteurs: un
		authentificateur qui va permettre le stockage de la clé privée. le navigateur qui va jouer le
		role d'intermédiaire entre l'authentificateur et le troisième acteur, le serveur qui va jouer le
		rôle de Bob dans l'illustration précédenter et stocker la clé publique associée à la clé privée
		de l'authentificateur. La communication entre l'authentificateur et l'authentificateur est
		couverte par le protocole CTAP pour Client to Authenticator Protocol. Et ça, c'est l'alliance
		FIDO qui va le gérer. De l'autre côté, la communication entre le navigateur et le serveur et
		l'API JavaScript mise à disposition par le navigateur va être couverte par le W3C qui va éditer
		des recommandations WebAuthn. Le CTAP, on ne va pas détailler plus dans cette présentation parce
		qu'en fait c'est vraiment utile quand on va fabriquer un authentificateur. Là, on est dans le
		cadre d'une application et on va se focaliser uniquement sur la partie WebAuthn.
	</SpeakerNotes>
</Slide>

<style>
	.acronym {
		margin: 0;
		text-align: center;
		font-size: 34px;

		strong {
			color: var(--slyd-headings-color);
		}
	}

	.stage {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 60px;
		margin-top: 90px;
	}

	.actors {
		display: flex;
		align-items: center;
	}

	.protocols {
		padding-top: 2em;
		display: flex;
		gap: 70px;
	}

	/*  Acteurs : même grammaire que les cartouches des slides précédentes  */
	.actor {
		width: 420px;
		margin: 0;
		border: 6px solid var(--night-silhouette);
		box-shadow: 12px 14px 0 var(--night-silhouette);
		background: #fff;
		transition:
			filter 0.6s ease,
			opacity 0.6s ease;

		&.authenticator {
			rotate: -1.5deg;
		}

		&.browser {
			rotate: 1deg;
		}

		&.server {
			rotate: -1deg;
		}
	}

	figcaption {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 10px 0 14px;
		line-height: 1.2;

		strong {
			font-family: var(--slyd-headings-font), sans-serif;
			font-weight: 400;
			font-size: 44px;
			text-transform: uppercase;
		}

		span {
			font-size: 26px;
			font-weight: 600;
		}
	}

	/*  Badge de clé : rappel de Lucia (privée) et Jason (publique)  */
	.key-badge {
		position: absolute;
		top: -36px;
		right: -36px;
		display: grid;
		place-items: center;
		width: 110px;
		height: 110px;
		border: 5px solid var(--night-silhouette);
		border-radius: 50%;
		box-shadow: 6px 7px 0 var(--night-silhouette);
		background: var(--sunset-yellow);
		rotate: 8deg;

		:global(.crypto-key) {
			margin: 0;
		}
	}

	/*  Sous-titre coloré comme la clé de l'acteur  */
	.authenticator figcaption span {
		color: var(--slyd-headings-color);
	}

	.server figcaption span {
		color: #0b6f78;
	}

	/*  Itinéraire : le panneau jaune « poppe » une fois la flèche GPS tracée  */
	.route {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		width: 250px;
		transition:
			filter 0.6s ease,
			opacity 0.6s ease;

		.label {
			padding: 0 16px;
			border: 5px solid var(--night-silhouette);
			box-shadow: 6px 7px 0 var(--night-silhouette);
			background: var(--sunset-yellow);
			font-family: var(--slyd-headings-font), sans-serif;
			font-size: 34px;
			text-transform: uppercase;
			rotate: -3deg;
			opacity: 0;
			scale: 0.6;
			transition:
				opacity 0.2s ease 0.5s,
				scale 0.35s cubic-bezier(0.2, 1.6, 0.4, 1) 0.5s;
		}

		svg {
			width: 180px;
			overflow: visible;
		}

		path {
			fill: none;
			stroke: var(--sunset-pink);
			stroke-width: 12;
			stroke-linecap: round;
			stroke-linejoin: round;
			stroke-dasharray: 1 1;
			stroke-dashoffset: 1;
			visibility: hidden;
			transition: stroke-dashoffset 0.6s ease-in-out;
		}

		&:global(.revealed) {
			.label {
				opacity: 1;
				scale: 1;
			}

			path {
				visibility: visible;
				stroke-dashoffset: 0;
			}
		}
	}

	/*  Fiches protocole  */
	.protocol {
		position: relative;
		width: 600px;
		box-sizing: border-box;
		padding: 12px 28px;
		border: 6px solid var(--night-silhouette);
		box-shadow: 10px 12px 0 var(--night-silhouette);
		outline: 0 solid var(--sunset-yellow);
		outline-offset: 6px;
		background: #fff;
		text-align: center;
		opacity: 0;
		scale: 0.6;
		transition:
			opacity 0.2s ease 0.5s,
			scale 0.35s cubic-bezier(0.2, 1.6, 0.4, 1) 0.5s,
			filter 0.6s ease,
			outline-width 0.3s ease;

		&:global(.revealed) {
			opacity: 1;
			scale: 1;
		}

		h4 {
			margin: 0 0 4px;
			font-family: var(--slyd-headings-font), sans-serif;
			font-weight: 400;
			font-size: 34px;
			text-transform: uppercase;
			color: var(--slyd-main-color);

			strong {
				font-weight: 400;
				color: var(--slyd-headings-color);
			}
		}

		p {
			margin: 0;
			font-size: 28px;
		}
	}

	/*  Tampon de l'organisme de standardisation  */
	.stamp {
		position: absolute;
		top: -26px;
		right: -30px;
		padding: 0 10px;
		border: 4px solid var(--slyd-headings-color);
		border-radius: 6px;
		background: #fff;
		color: var(--slyd-headings-color);
		font-family: var(--slyd-headings-font), sans-serif;
		font-size: 24px;
		text-transform: uppercase;
		rotate: 10deg;
	}

	/*  Focus : la partie CTAP passe en noir et blanc, WebAuthn devient l'objectif  */
	.stage:has(.focus:global(.revealed)) {
		.authenticator,
		.ctap {
			filter: grayscale(1) contrast(0.8);
			opacity: 0.55;
		}

		.protocol.webauthn {
			outline-width: 10px;
		}
	}
</style>
