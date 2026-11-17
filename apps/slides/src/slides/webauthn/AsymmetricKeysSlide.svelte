<script lang="ts">
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
	import CryptoKey from '#lib/components/cryptography/CryptoKey.svelte';
</script>

<Slide>
	<h3>Clés asymétriques</h3>

	<!--  La paire : un seul cartouche, deux moitiés collées  -->
	<div class="pair">
		<figure class="half private">
			<div class="artwork">
				<CryptoKey orientation="vertical" size="260" type="private" />
			</div>
			<figcaption><strong>Clé privée</strong><span>À garder secrète</span></figcaption>
		</figure>
		<figure class="half public">
			<div class="artwork">
				<!--  Projecteurs de panneau publicitaire  -->
				<span aria-hidden="true" class="spotlights"></span>
				<CryptoKey orientation="vertical" size="260" type="public" />
			</div>
			<figcaption><strong>Clé publique</strong><span>Partageable</span></figcaption>
		</figure>
	</div>

	<!--  Itinéraires GPS de la paire vers ses usages  -->
	<svg aria-hidden="true" class="gps" viewBox="0 0 1920 1080">
		<path
			class="fragment custom"
			d="M 960 680 C 960 740, 550 700, 550 770"
			data-fragment-index="0"
			pathLength="1"
		/>
		<path
			class="fragment custom"
			d="M 960 680 C 960 740, 1370 700, 1370 770"
			data-fragment-index="1"
			pathLength="1"
		/>
	</svg>

	<div class="uses">
		<section class="usage encryption fragment custom" data-fragment-index="0">
			<h4>Chiffrement</h4>
			<p><strong class="public">Clé publique</strong> <span aria-hidden="true">→</span> chiffrer</p>
			<p>
				<strong class="private">Clé privée</strong> <span aria-hidden="true">→</span> déchiffrer
			</p>
		</section>
		<section class="usage signature fragment custom" data-fragment-index="1">
			<h4>Signature</h4>
			<p><strong class="private">Clé privée</strong> <span aria-hidden="true">→</span> signer</p>
			<p><strong class="public">Clé publique</strong> <span aria-hidden="true">→</span> vérifier</p>
		</section>
		<!--  Dernier clic : la signature devient l'objectif de mission  -->
		<span aria-hidden="true" class="focus fragment custom" data-fragment-index="2"></span>
	</div>

	<SpeakerNotes>
		Je parlais à l'instant de paires de clés. C'est basé sur la cryptographie asymétrique avec une
		paire de clés constituée d'une clé privée. Celle-là, comme son nom l'indique, elle est à garder
		secrète. Et associée à cette clé privée, on va lui adjoindre une clé publique qui, elle, va
		pouvoir être partagée. Et classiquement, on va pouvoir faire deux choses avec ces clés.
		Premièrement, le chiffrement, ou avec la clé publique qui va permettre de chiffrer quelque chose
		et la clé privée qui va permettre de déchiffrer et signer quelque chose avec la clé privée et
		utiliser la clé publique pour vérifier la signature. Par la suite, ce qui nous... Ce qui va nous
		préoccuper en fait, c'est la signature Et plus particulièrement, comment est-ce qu'on va pouvoir
		l'utiliser pour authentifier quelqu'un.
	</SpeakerNotes>
</Slide>

<style>
	/*  Cartouche BD : contour épais, ombre portée dure, légère inclinaison  */
	.pair {
		display: flex;
		width: 900px;
		margin: 36px auto 0;
		border: 6px solid var(--night-silhouette);
		box-shadow: 14px 16px 0 var(--night-silhouette);
		background: #fff;
		rotate: -1.5deg;
	}

	/*  Chaque moitié : illustration + légende ; la bordure de la moitié publique sépare les deux  */
	.half {
		flex: 1;
		margin: 0;

		&.public {
			border-left: 6px solid var(--night-silhouette);
		}
	}

	.artwork {
		position: relative;
		height: 300px;
		display: grid;
		place-items: center;
		overflow: hidden;
		border-bottom: 6px solid var(--night-silhouette);

		:global(.crypto-key) {
			position: relative;
			margin: 0;
		}
	}

	.private .artwork {
		background:
			radial-gradient(circle, rgb(255 255 255 / 0.14) 2px, transparent 2.5px) 0 0 / 18px 18px,
			linear-gradient(180deg, #4a3590 0%, #6e3a8f 100%);
	}

	.public .artwork {
		background:
			radial-gradient(circle, rgb(255 255 255 / 0.35) 2px, transparent 2.5px) 0 0 / 18px 18px,
			linear-gradient(
				180deg,
				var(--sunset-yellow) 0%,
				var(--sunset-orange) 60%,
				var(--sunset-pink) 100%
			);
	}

	.spotlights {
		position: absolute;
		inset: 0;
		background: repeating-conic-gradient(
			from 0deg at 50% 120%,
			rgb(255 255 255 / 0.35) 0deg 6deg,
			transparent 6deg 16deg
		);
	}

	figcaption {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 14px 0 18px;
		line-height: 1.2;

		strong {
			font-family: var(--slyd-headings-font), sans-serif;
			font-weight: 400;
			font-size: 52px;
			text-transform: uppercase;
		}

		span {
			font-size: 30px;
		}
	}

	.private figcaption strong {
		color: var(--slyd-headings-color);
	}

	.public figcaption strong {
		color: #0b6f78;
	}

	/*  Tracés GPS : dessinés depuis la paire à l'apparition de chaque usage  */
	.gps {
		position: absolute;
		inset: 0;
		width: 1920px;
		height: 1080px;
		pointer-events: none;

		path {
			fill: none;
			stroke: var(--sunset-pink);
			stroke-width: 10;
			stroke-linecap: round;
			stroke-dasharray: 1 1;
			stroke-dashoffset: 1;
			/*  Masqué tant que non révélé : sinon le bout arrondi laisse un point rose  */
			visibility: hidden;
			transition: stroke-dashoffset 0.5s ease-in-out;

			&:global(.revealed) {
				visibility: visible;
				stroke-dashoffset: 0;
			}
		}
	}

	/*  Usages : cartouches BD qui « poppent » au bout de l'itinéraire  */
	.uses {
		position: absolute;
		top: 770px;
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
		gap: 300px;
	}

	.usage {
		width: 520px;
		box-sizing: border-box;
		padding: 14px 32px;
		border: 6px solid var(--night-silhouette);
		box-shadow: 10px 12px 0 var(--night-silhouette);
		outline: 0 solid var(--sunset-yellow);
		outline-offset: 6px;
		background: #fff;
		opacity: 0;
		scale: 0.6;
		transition:
			opacity 0.2s ease 0.4s,
			scale 0.35s cubic-bezier(0.2, 1.6, 0.4, 1) 0.4s,
			filter 0.6s ease,
			outline-width 0.3s ease;

		&:global(.revealed) {
			opacity: 1;
			scale: 1;
		}

		h4 {
			margin: 0 0 6px;
			font-family: var(--slyd-headings-font), sans-serif;
			font-weight: 400;
			font-size: 44px;
			text-transform: uppercase;
			color: var(--slyd-main-color);
		}

		p {
			margin: 0;
			font-size: 32px;
		}

		.private {
			color: var(--slyd-headings-color);
		}

		.public {
			color: #0b6f78;
		}
	}

	.focus {
		position: absolute;
	}

	/*  Focus : le chiffrement passe en noir et blanc, la signature devient l'objectif (jaune)  */
	.uses:has(.focus:global(.revealed)) {
		.encryption {
			filter: grayscale(1) contrast(0.8);
			opacity: 0.55;
		}

		.signature {
			outline-width: 10px;
		}
	}
</style>
