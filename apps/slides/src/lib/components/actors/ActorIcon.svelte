<script lang="ts">
	type Actor = 'authenticator' | 'browser' | 'server';

	type Props = {
		actor: Actor;
		/** Côté de l'icône, en pixels */
		size?: number;
	};

	const { actor, size = 120 }: Props = $props();
</script>

<!--  Icône seule d'un acteur FIDO2 : reprend un dessin de son illustration, sans cadre  -->
<svg
	aria-hidden="true"
	class="icon"
	style:width="{size}px"
	style:height="{size}px"
	viewBox="0 0 100 100"
>
	{#if actor === 'authenticator'}
		<!--  Téléphone avec capteur biométrique  -->
		<rect class="body" height="88" rx="8" width="48" x="26" y="6" />
		<rect class="screen" height="58" rx="2" width="36" x="32" y="16" />
		<path
			class="fingerprint"
			d="M 42 52 C 42 38, 58 38, 58 52 M 46 58 C 46 44, 54 44, 54 58 M 50 46 V 62"
		/>
	{:else if actor === 'browser'}
		<!--  Fenêtre de navigateur vide  -->
		<rect class="body" height="72" rx="6" width="88" x="6" y="14" />
		<path class="toolbar" d="M 6 20 A 6 6 0 0 1 12 14 H 88 A 6 6 0 0 1 94 20 V 32 H 6 Z" />
		<circle class="dot pink" cx="17" cy="23" r="4" />
		<circle class="dot orange" cx="29" cy="23" r="4" />
		<circle class="dot yellow" cx="41" cy="23" r="4" />
	{:else}
		<!--  Serveur en rack  -->
		<rect class="body" height="24" rx="4" width="64" x="18" y="10" />
		<rect class="body" height="24" rx="4" width="64" x="18" y="38" />
		<rect class="body" height="24" rx="4" width="64" x="18" y="66" />
		<circle class="led" cx="70" cy="22" r="4" />
		<circle class="led" cx="70" cy="50" r="4" />
		<circle class="led" cx="70" cy="78" r="4" />
	{/if}
</svg>

<style>
	/*  Mêmes aplats et contours que les illustrations des acteurs  */
	.icon {
		display: block;
		overflow: visible;
	}

	:is(.body, .screen, .toolbar, .led) {
		stroke: var(--night-silhouette);
		stroke-width: 5;
		stroke-linejoin: round;
	}

	.body {
		fill: #fff;
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

	.toolbar {
		fill: var(--night);
	}

	.dot {
		&.pink {
			fill: var(--sunset-pink);
		}

		&.orange {
			fill: var(--sunset-orange);
		}

		&.yellow {
			fill: var(--sunset-yellow);
		}
	}

	.led {
		fill: #2fd67b;
	}
</style>
