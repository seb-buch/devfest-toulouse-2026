<script lang="ts">
	import type { Snippet } from 'svelte';

	type Actor = 'authenticator' | 'browser' | 'server';

	type Props = {
		actor: Actor;
		/** Hauteur de la bande d'illustration, en pixels */
		height?: number;
		/** Échelle du dessin : 1 sur la slide FIDO2, plus petit dans les cérémonies */
		scale?: number;
		/** Éléments posés sur l'illustration (badge de clé…) */
		children?: Snippet;
	};

	const { actor, height = 280, scale = 1, children }: Props = $props();
</script>

<!--  Illustration d'un acteur FIDO2, sur le fond de sa couleur  -->
<div class="artwork {actor}" style:height="{height}px">
	<div class="drawing" style:zoom={scale}>
		{#if actor === 'authenticator'}
			<div class="devices">
				<!--  Clé de sécurité USB  -->
				<svg aria-hidden="true" viewBox="0 0 100 100">
					<rect class="metal" height="32" rx="3" width="26" x="8" y="34" />
					<rect class="body" height="48" rx="10" width="62" x="30" y="26" />
					<circle class="button" cx="60" cy="50" r="12" />
				</svg>
				<!--  Téléphone avec capteur biométrique  -->
				<svg aria-hidden="true" viewBox="0 0 100 100">
					<rect class="body" height="88" rx="8" width="48" x="26" y="6" />
					<rect class="screen" height="58" rx="2" width="36" x="32" y="16" />
					<path
						class="fingerprint"
						d="M 42 52 C 42 38, 58 38, 58 52 M 46 58 C 46 44, 54 44, 54 58 M 50 46 V 62"
					/>
				</svg>
				<!--  Ordinateur portable  -->
				<svg aria-hidden="true" viewBox="0 0 100 100">
					<rect class="body" height="44" rx="4" width="68" x="16" y="22" />
					<rect class="screen" height="32" width="56" x="22" y="28" />
					<path class="body" d="M 6 72 H 94 L 88 82 H 12 Z" />
				</svg>
			</div>
		{:else if actor === 'browser'}
			<div class="window">
				<div class="toolbar">
					<span class="dot"></span><span class="dot"></span><span class="dot"></span>
				</div>
				<div class="url">🔒 gta-passkeys-city.demo</div>
				<div class="page">
					<span class="line"></span>
					<span class="line short"></span>
					<span class="login">Se connecter</span>
				</div>
			</div>
		{:else}
			<!--  Serveur en rack  -->
			<svg aria-hidden="true" class="rack" viewBox="0 0 100 100">
				<rect class="body" height="24" rx="4" width="64" x="18" y="10" />
				<rect class="body" height="24" rx="4" width="64" x="18" y="38" />
				<rect class="body" height="24" rx="4" width="64" x="18" y="66" />
				<circle class="led" cx="70" cy="22" r="4" />
				<circle class="led" cx="70" cy="50" r="4" />
				<circle class="led" cx="70" cy="78" r="4" />
			</svg>
		{/if}
	</div>
	{@render children?.()}
</div>

<style>
	.artwork {
		position: relative;
		display: grid;
		place-items: center;
		border-bottom: 6px solid var(--night-silhouette);
	}

	/*  Icônes : aplats blancs, contour sombre épais  */
	svg :is(.body, .metal, .screen, .button, .led) {
		stroke: var(--night-silhouette);
		stroke-width: 5;
		stroke-linejoin: round;
	}

	/*  Authentificateur : fond violet de la clé privée  */
	.authenticator {
		background:
			radial-gradient(circle, rgb(255 255 255 / 0.14) 2px, transparent 2.5px) 0 0 / 18px 18px,
			linear-gradient(180deg, #4a3590 0%, #6e3a8f 100%);
	}

	.devices {
		display: flex;
		gap: 8px;

		svg {
			width: 116px;
			height: 116px;
		}

		.body {
			fill: #fff;
		}

		.metal {
			fill: var(--sunset-yellow);
		}

		.button {
			fill: var(--sunset-orange);
		}

		.screen {
			fill: #2b2160;
		}

		.fingerprint {
			fill: none;
			stroke: var(--sunset-pink);
			stroke-width: 4;
			stroke-linecap: round;
		}
	}

	/*  Navigateur : fenêtre minimaliste sur le domaine de la démo  */
	.browser {
		background:
			radial-gradient(circle, rgb(12 8 25 / 0.12) 2px, transparent 2.5px) 0 0 / 18px 18px,
			#e9e4f5;
	}

	.window {
		width: 340px;
		border: 5px solid var(--night-silhouette);
		border-radius: 10px;
		overflow: hidden;
		background: #fff;
	}

	.toolbar {
		display: flex;
		gap: 8px;
		padding: 8px 10px;
		background: var(--night);

		.dot {
			width: 14px;
			height: 14px;
			border-radius: 50%;
			background: var(--sunset-pink);

			&:nth-child(2) {
				background: var(--sunset-orange);
			}

			&:nth-child(3) {
				background: var(--sunset-yellow);
			}
		}
	}

	.url {
		margin: 8px 10px;
		padding: 2px 10px;
		border: 3px solid var(--night-silhouette);
		border-radius: 20px;
		font-size: 18px;
		font-weight: 600;
		white-space: nowrap;
	}

	.page {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		padding: 6px 0 14px;

		.line {
			width: 220px;
			height: 12px;
			border-radius: 6px;
			background: #d8d2e8;

			&.short {
				width: 150px;
			}
		}

		.login {
			margin-top: 4px;
			padding: 2px 18px;
			border: 3px solid var(--night-silhouette);
			background: var(--sunset-yellow);
			font-family: var(--slyd-headings-font), sans-serif;
			font-size: 20px;
			text-transform: uppercase;
		}
	}

	/*  Serveur : fond coucher de soleil de la clé publique  */
	.server {
		background:
			radial-gradient(circle, rgb(255 255 255 / 0.35) 2px, transparent 2.5px) 0 0 / 18px 18px,
			linear-gradient(
				180deg,
				var(--sunset-yellow) 0%,
				var(--sunset-orange) 60%,
				var(--sunset-pink) 100%
			);
	}

	.rack {
		width: 190px;
		height: 190px;

		.body {
			fill: #fff;
		}

		.led {
			fill: #2fd67b;
		}
	}
</style>
