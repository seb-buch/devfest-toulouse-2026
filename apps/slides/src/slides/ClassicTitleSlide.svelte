<script lang="ts">
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';

	import devfestLogo from '#lib/assets/slides/devfest-toulouse-logo.svg';
</script>

<!-- Fausse page de titre « corporate », sans aucune référence à GTA : la vraie arrive juste après -->
<Slide>
	<div class="classic-title">
		<h1>
			Passkeys
			<span class="tagline">Adieu les mots de passe, bonjour la sécurité sans friction</span>
		</h1>
		<footer>
			<div>
				<p class="speaker">Sébastien Buchoux</p>
				<p class="date">19 novembre 2026</p>
			</div>
			<img alt="DevFest Toulouse" class="event-logo" src={devfestLogo} />
		</footer>
	</div>
	<SpeakerNotes>
		Bonjour à tous ! Avant de commencer, je voudrais évidemment remercier le DevFest Toulouse pour
		l'organisation et pour me permettre de vous parler pendant une quarantaine de minutes
		d'authentification et de passkeys. Alors, le truc c'est qu'aujourd'hui, on est le 19 novembre,
		peut-être que vous avez entendu parler d'un petit jeu indépendant qui sort aujourd'hui… Alors
		pour ceux qui auraient préféré être devant leur console, j'ai fait un effort&nbsp;! (coupe
		franche vers la vraie page de titre)
	</SpeakerNotes>
</Slide>

<style>
	/* Neutralise le thème : fond blanc, pas de liseré coucher de soleil */
	:global(main.slyd .slyd-slide:has(> .classic-title)) {
		background-color: #fff;
	}

	:global(main.slyd .slyd-slide:has(> .classic-title)::after) {
		display: none;
	}

	.classic-title {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0 160px;
		font-family: 'Poppins', sans-serif;
		color: #2b2b2b;

		h1 {
			display: flex;
			flex-direction: column;
			gap: 0.4em;
			font-family: 'Poppins', sans-serif;
			font-size: 120px;
			font-weight: 700;
			text-transform: none;
			letter-spacing: -0.02em;
			color: #2b2b2b;
			padding-left: 40px;
			border-left: 12px solid #ec6839;
		}

		.tagline {
			font-size: 44px;
			font-weight: 300;
			letter-spacing: 0;
			color: #666;
		}

		footer {
			position: absolute;
			left: 160px;
			right: 160px;
			bottom: 80px;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.speaker {
			margin: 0;
			font-size: 40px;
			font-weight: 600;
		}

		.date {
			margin: 0;
			font-size: 32px;
			color: #666;
		}

		.event-logo {
			height: 120px;
		}
	}
</style>
