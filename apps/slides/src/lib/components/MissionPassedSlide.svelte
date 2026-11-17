<script lang="ts" module>
	export type ObjectiveStatus = 'passed' | 'failed' | 'warning';

	export type Objective = {
		label: string;
		detail?: string;
		link?: { href: string; text: string };
		status: ObjectiveStatus;
		/** Objectif secondaire, en plus de la mission : affiché à part avec une étiquette « Bonus » */
		bonus?: boolean;
	};
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
	import { missions, type MissionName } from '#lib/components/map/map-info.ts';

	/*
	 * Bilan de mission façon écran de fin de mission de GTA V : « Mission accomplie »,
	 * objectifs révélés un par un, puis astuce (boîte d'aide en haut à gauche) vers la suite.
	 */
	type Props = {
		/** Le nom de mission vient de map-info.ts */
		mission: MissionName;
		background: string;
		objectives: Objective[];
		/** Astuce affichée en dernier : la question qui mène à la mission suivante */
		hint?: string;
		children?: Snippet;
	};

	const { mission, background, objectives, hint, children }: Props = $props();
	const title = $derived(missions[mission].title);

	const statusMarks: Record<ObjectiveStatus, string> = {
		passed: '✓',
		failed: '✕',
		warning: '⚠'
	};
</script>

<Slide>
	<div class="night illustrated">
		<img alt="" class="backdrop" src={background} />

		{#if hint}
			<p class="hint fragment" data-fragment-index={objectives.length}>{hint}</p>
		{/if}

		<div class="band">
			<h2>Mission accomplie</h2>
			<p class="mission-title">{@html title}</p>

			<ul>
				{#each objectives as objective, index (objective.label)}
					<li class={['fragment', { bonus: objective.bonus }]} data-fragment-index={index}>
						<span class="label">
							{#if objective.bonus}<span class="bonus-tag">Bonus</span>{/if}
							{objective.label}
							{#if objective.detail}<span class="detail">{objective.detail}</span>{/if}
							{#if objective.link}
								<a href={objective.link.href} target="_blank" rel="external noreferrer"
									>{objective.link.text}&nbsp;↗</a
								>
							{/if}
						</span>
						<span class={['mark', objective.status]}>{statusMarks[objective.status]}</span>
					</li>
				{/each}
			</ul>
		</div>
	</div>
	<SpeakerNotes>
		{@render children?.()}
	</SpeakerNotes>
</Slide>

<style>
	/*  Décor de l'écran de chargement de la mission, flouté et assombri comme sur la slide titre  */
	.backdrop {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: blur(14px) brightness(0.5);
		scale: 1.08;
	}

	/*  Bandeau sombre translucide au centre, comme l'écran de fin de mission du jeu  */
	.band {
		position: absolute;
		left: 0;
		right: 0;
		top: 50%;
		translate: 0 -50%;
		padding: 40px 0 44px;
		background: rgb(0 0 0 / 0.65);
		color: #fff;
		text-align: center;

		> * {
			width: 1500px;
			margin-inline: auto;
		}
	}

	h2 {
		margin-block: 0;
		font-family: 'Pricedown', sans-serif;
		font-size: 120px;
		line-height: 1;
		text-transform: none;
		color: var(--sunset-yellow);
		text-shadow:
			0 0 4px #000,
			4px 5px 0 #000;
	}

	.mission-title {
		margin-block: 8px 28px;
		font-family: var(--slyd-headings-font), sans-serif;
		font-size: 48px;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	/*  Objectifs en police des sous-titres de GTA V, marque alignée à droite  */
	ul {
		margin-bottom: 0;
		padding: 0;
		list-style: none;
		border-block: 2px solid rgb(255 255 255 / 0.35);
	}

	li {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 32px;
		padding-block: 16px;
		font-family: 'Chalet London', var(--slyd-main-font), sans-serif;
		font-size: 36px;
		line-height: 1.5;
		text-align: left;
	}

	/*  Objectif bonus : séparé des objectifs de la mission, étiquette dorée  */
	.bonus {
		margin-top: 12px;
		border-top: 2px dashed rgb(255 255 255 / 0.35);
	}

	.bonus-tag {
		margin-right: 0.5em;
		padding: 2px 12px;
		border-radius: 4px;
		background: var(--sunset-yellow);
		color: #000;
		font-family: var(--slyd-headings-font), sans-serif;
		font-size: 28px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		vertical-align: middle;
	}

	.detail {
		margin-left: 0.4em;
		color: rgb(255 255 255 / 0.7);

		&::before {
			content: '— ';
		}
	}

	a {
		margin-left: 0.4em;
		color: var(--vice-teal);
	}

	.mark {
		font-size: 40px;

		&.passed {
			color: #6fdc6f;
		}

		&.failed {
			color: #ff5a5a;
		}

		&.warning {
			color: var(--sunset-yellow);
		}
	}

	/*  Boîte d'aide en haut à gauche, comme les astuces de GTA V  */
	.hint {
		position: absolute;
		top: 60px;
		left: 60px;
		max-width: 720px;
		margin: 0;
		padding: 24px 32px;
		border-radius: 4px;
		background: rgb(0 0 0 / 0.8);
		color: #fff;
		font-family: 'Chalet London', var(--slyd-main-font), sans-serif;
		font-size: 36px;
		line-height: 1.35;
	}
</style>
