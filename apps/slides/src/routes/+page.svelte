<script lang="ts">
	import { resolve } from '$app/paths';
	import '#lib/theme/theme.css';
	import '#lib/theme/additional.css';
	import githubIcon from '#lib/assets/icons/brands/github.svg';
	import GameTitle from '#lib/components/GameTitle.svelte';

	const FEEDBACK_URL =
		'https://devfesttoulouse.fr/en/conferences/passkeys-adieu-les-mots-de-passe-bonjour-la-securite-sans-friction';
	const REPO_URL = 'https://github.com/seb-buch/devfest-toulouse-2026';

	/*  Le logo GTA a une taille fixe : on le réduit sur les petits écrans (gouttière de 16px)  */
	const LOGO_RATIO = 335 / 650;
	const LOGO_MAX_HEIGHT = 300;

	let viewportWidth = $state(1024);
	const logoHeight = $derived(Math.min(LOGO_MAX_HEIGHT, (viewportWidth - 32) * LOGO_RATIO));
</script>

<svelte:head>
	<title>Passkeys — Devfest Toulouse 2026 · Sébastien Buchoux</title>
</svelte:head>

<svelte:window bind:innerWidth={viewportWidth} />

<main class="index">
	<header>
		<GameTitle height={logoHeight} />
	</header>

	<!--  Menu pause de GTA V : entrée sélectionnée sur fond blanc  -->
	<nav aria-label="Menu principal">
		<p class="menu-title">Menu</p>
		<ul>
			<li>
				<a href={resolve('/presentation')}>Lancer la présentation</a>
			</li>
			<li>
				<a href={FEEDBACK_URL} target="_blank" rel="noopener noreferrer">Donner votre avis</a>
			</li>
			<li>
				<a href={REPO_URL} target="_blank" rel="noopener noreferrer">
					<span>Code source</span>
					<img src={githubIcon} alt="GitHub" />
				</a>
			</li>
		</ul>
	</nav>
</main>

<style>
	:global(body) {
		margin: 0;
		background-color: var(--slyd-slide-bg-color);
	}

	/*  Fond clair des diapos de contenu, avec leur liseré coucher de soleil en bas  */
	.index {
		position: relative;
		min-height: 100dvh;
		box-sizing: border-box;
		padding: 48px 16px 62px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 56px;
		color: #fff;
		font-family: var(--slyd-main-font), sans-serif;

		&::after {
			content: '';
			position: absolute;
			left: 0;
			right: 0;
			bottom: 0;
			height: 14px;
			background: var(--sunset-gradient);
		}
	}

	nav {
		width: min(520px, 100%);
		background: rgb(0 0 0 / 0.65);
		box-shadow: 0 8px 32px rgb(0 0 0 / 0.6);

		/*  Liseré coucher de soleil, comme en bas des diapos  */
		&::before {
			content: '';
			display: block;
			height: 8px;
			background: var(--sunset-gradient);
		}
	}

	.menu-title {
		margin: 0;
		padding: 12px 24px 4px;
		font-family: var(--slyd-headings-font), sans-serif;
		font-size: 22px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--sunset-yellow);
	}

	ul {
		margin: 0;
		padding: 8px 0 16px;
		list-style: none;
	}

	a {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 10px 24px;
		font-family: var(--slyd-headings-font), sans-serif;
		font-size: 34px;
		line-height: 1.2;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		text-decoration: none;
		color: #fff;
		transition:
			background-color 0.15s,
			color 0.15s;

		img {
			width: 28px;
			height: 28px;
			filter: invert(1);
		}

		&:hover,
		&:focus-visible {
			background-color: #fff;
			color: var(--night-silhouette);
			outline: none;

			img {
				filter: none;
			}
		}
	}

	@media (max-width: 600px) {
		.index {
			gap: 40px;
		}

		a {
			font-size: 28px;
			padding: 12px 16px;
		}

		.menu-title {
			padding-inline: 16px;
		}
	}
</style>
