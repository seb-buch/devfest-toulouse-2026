<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
	import { type MissionName, missionNumber, missions } from '#lib/components/map/map-info.ts';

	/*
	 * Slide titre de mission, juste après l'écran de chargement (SectionLoadingSlide) :
	 * le personnage passe d'une slide à l'autre par la view transition `mission-character`.
	 */
	type Props = {
		/** Titre, brief et quartier viennent de map-info.ts */
		mission: MissionName;
		background: string;
		foreground: string;
		children?: Snippet;
	};

	const { mission: position, background, foreground, children }: Props = $props();
	const mission = $derived(missionNumber(position));
	const { title, brief, district } = $derived(missions[position]);
</script>

<Slide>
	<div class="night illustrated">
		<img alt="" class="backdrop" src={background} />
		<img alt="" class="character" src={foreground} />
		<div class="section-title">
			{#if mission !== undefined}
				<p class="mission">Mission {mission}</p>
			{/if}
			<h2 class="logo">{@html title}</h2>
			<p class="brief">{@html brief}</p>
		</div>
		<p class="location">{@html district}</p>
	</div>
	<SpeakerNotes>
		{@render children?.()}
	</SpeakerNotes>
</Slide>

<style>
	/*  Décor de l'écran de chargement, flouté et assombri  */
	.backdrop {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: blur(14px) brightness(0.45);
		scale: 1.08;
	}

	.character {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transform-origin: 20% 100%;
		transform: translateX(-10%) scale(0.7);
	}

	/*
   * Même nom de view transition que dans SectionLoadingSlide.
   * Pas de nom en vue d'ensemble : toutes les slides y sont affichées, les noms seraient en double.
   */
	:global(.slyd:not(.overview)) .character {
		view-transition-name: mission-character;
	}

	:global(::view-transition-group(mission-character)) {
		animation-duration: 0.6s;
		animation-timing-function: ease-in-out;
	}

	/*
   * Le nom de mission se transforme en titre (h3) de la slide suivante.
   * Pas de nom en vue d'ensemble : toutes les slides y sont affichées, les noms seraient en double.
   */
	:global(.slyd:not(.overview)) .section-title h2,
	:global(
		.slyd:not(.overview)
			.slyd-slide-wrapper:has(.section-title)
			+ .slyd-slide-wrapper
			> .slyd-slide
			> h3
	) {
		view-transition-name: mission-title;
	}

	:global(::view-transition-group(mission-title)) {
		animation-duration: 0.6s;
		animation-timing-function: ease-in-out;
	}

	/*  Captures non déformées et calées à gauche, comme les deux titres  */
	:global(::view-transition-old(mission-title)),
	:global(::view-transition-new(mission-title)) {
		height: 100%;
		object-fit: contain;
		object-position: left center;
	}

	/*
   * Personnage sans équivalent de l'autre côté (slide titre ↔ slide suivante) :
   * il s'efface au rythme du fond au lieu de garder la durée de sa transition avec l'écran de chargement.
   */
	:global(::view-transition-old(mission-character):only-child),
	:global(::view-transition-new(mission-character):only-child) {
		animation-duration: var(--slyd-fade-duration);
		animation-timing-function: ease;
	}

	.section-title {
		position: relative;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 0 100px 80px 50%;
		box-sizing: border-box;
		text-align: left;
	}

	/*  Étiquette en police des menus de GTA V, jaune comme les missions sur la carte du jeu  */
	.mission {
		margin: 0 0 24px;
		font-family: var(--slyd-headings-font), sans-serif;
		font-size: 44px;
		font-weight: 400;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--sunset-yellow);
		text-shadow: 0 2px 8px rgb(0 0 0 / 0.8);
	}

	/*  Nom de mission en Pricedown, comme au centre de l'écran dans GTA V (passe devant `.night .logo`)  */
	.section-title h2 {
		margin: 0;
		font-family: 'Pricedown', sans-serif;
		font-size: 110px;
		line-height: 1.05;
		text-wrap: balance;
	}

	/*  Nom du quartier en bas à droite, comme à l'entrée dans un lieu dans GTA V  */
	.location {
		position: absolute;
		right: 70px;
		bottom: 50px;
		margin: 0;
		font-family: var(--script-font), sans-serif;
		font-size: 36px;
		line-height: 1;
		color: #fff;
		text-shadow: 0 2px 6px rgb(0 0 0 / 0.8);
	}

	/*  En police des sous-titres de GTA V  */
	.brief {
		font-family: 'Chalet London', var(--slyd-main-font), sans-serif;
		margin: 40px 0 0;
		font-size: 40px;
		line-height: 1.4;
		color: #fff;
		text-wrap: balance;
		text-shadow: 0 2px 8px rgb(0 0 0 / 0.8);
	}
</style>
