<script lang="ts">
	import Ceremony from '#lib/components/ceremony/Ceremony.svelte';
	import CeremonyBadge, {
		type CeremonyKind as Kind
	} from '#lib/components/ceremony/CeremonyBadge.svelte';
	import CeremonyStep from '#lib/components/ceremony/CeremonyStep.svelte';

	type Actor = 'authenticator' | 'browser' | 'server';

	type Props = {
		kind: Kind;
		/** Numéros des étapes mises en avant ; les autres sont estompées */
		highlight: number[];
		/** Libellés remplaçant ceux par défaut, par numéro d'étape */
		labels?: Partial<Record<number, string>>;
	};

	const { kind, highlight, labels = {} }: Props = $props();

	type Step = { number: number; from: Actor; to?: Actor; cardAt?: 'between' };

	/*  Les deux cérémonies ont la même forme ; seuls les libellés changent  */
	const STEPS: Step[] = [
		{ number: 1, from: 'server', to: 'browser' },
		{ number: 2, from: 'browser', to: 'authenticator' },
		{ number: 3, from: 'authenticator' },
		{ number: 4, from: 'authenticator', to: 'server', cardAt: 'between' },
		{ number: 5, from: 'server' }
	];

	const DEFAULT_LABELS: Record<Kind, string[]> = {
		registration: ['Options', 'create()', 'Nouvelle paire', 'Clé publique', 'Stockage'],
		authentication: ['Options', 'get()', 'Signature', 'Signature · user handle', 'Vérification']
	};

	const labelOf = (number: number) => labels[number] ?? DEFAULT_LABELS[kind][number - 1];
</script>

<!--  Miniature d'une cérémonie : situe une option dans le flux déjà présenté  -->
<div class="mini">
	<div class="badge">
		<CeremonyBadge {kind} size={110} />
	</div>
	<Ceremony mini>
		{#each STEPS as step (step.number)}
			<CeremonyStep {...step} dimmed={!highlight.includes(step.number)}>
				{#if highlight.includes(step.number)}
					<strong>{labelOf(step.number)}</strong>
				{:else}
					{labelOf(step.number)}
				{/if}
			</CeremonyStep>
		{/each}
	</Ceremony>
</div>

<style>
	/*  La cérémonie complète, réduite ; textes agrandis pour rester lisibles une fois réduits  */
	.mini {
		position: relative;
		flex-shrink: 0;
		/*  Écart avec le trait sous le titre  */
		margin-top: 50px;
		zoom: 0.45;

		:global(.ceremony) {
			margin: 0;
		}

		:global(.content) {
			font-size: 44px;
		}

		:global(.number) {
			font-size: 44px;
		}
	}

	/*  Symbole de la cérémonie, dans le coin supérieur gauche  */
	.badge {
		position: absolute;
		top: 0;
		left: 0;
	}
</style>
