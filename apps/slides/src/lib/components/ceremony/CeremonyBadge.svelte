<script lang="ts">
	export type CeremonyKind = 'registration' | 'authentication';

	type Props = {
		kind: CeremonyKind;
		/** Côté du badge, en pixels */
		size?: number;
	};

	const { kind, size = 64 }: Props = $props();

	const LABELS: Record<CeremonyKind, string> = {
		registration: 'Enregistrement',
		authentication: 'Authentification'
	};
</script>

<!--  Symbole d'une cérémonie : clé + pour l'enregistrement, cadenas pour l'authentification  -->
<span
	class="badge {kind}"
	style:width="{size}px"
	style:height="{size}px"
	role="img"
	aria-label={LABELS[kind]}
>
	<svg aria-hidden="true" viewBox="0 0 100 100">
		{#if kind === 'registration'}
			<!--  Clé, avec un « + » : une nouvelle passkey  -->
			<circle cx="32" cy="58" r="16" />
			<path d="M 46 58 H 84 M 72 58 V 72 M 82 58 V 68" />
			<path class="plus" d="M 70 12 V 40 M 56 26 H 84" />
		{:else}
			<!--  Cadenas : on se connecte  -->
			<path d="M 34 46 V 32 A 16 16 0 0 1 66 32 V 46" />
			<rect height="40" rx="6" width="56" x="22" y="46" />
			<path d="M 50 60 V 72" />
		{/if}
	</svg>
</span>

<style>
	/*  Cartouche GTA : bordure noire, ombre décalée, couleur propre à chaque cérémonie  */
	.badge {
		display: inline-grid;
		flex-shrink: 0;
		place-items: center;
		box-sizing: border-box;
		border: 4px solid var(--night-silhouette);
		border-radius: 12px;
		box-shadow: 4px 5px 0 var(--night-silhouette);
		vertical-align: middle;

		&.registration {
			background: var(--vice-teal);
		}

		&.authentication {
			background: var(--sunset-orange);
		}
	}

	svg {
		width: 78%;
		height: 78%;
		fill: none;
		stroke: var(--night-silhouette);
		stroke-width: 9;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.plus {
		stroke-width: 11;
	}
</style>
