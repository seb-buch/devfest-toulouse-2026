<script lang="ts">
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
	import githubPrompt from '#lib/assets/slides/github-passkey-prompt.png';
	import conditionalUi from '#lib/assets/slides/passkey-conditional-ui.png';
</script>

<Slide>
	<h3>Nouvelles missions disponibles</h3>

	<div class="missions">
		<section class="fragment">
			<p class="eyebrow">Mission utilisateur</p>
			<img
				src={githubPrompt}
				alt="GitHub propose de configurer une connexion sans mot de passe avec le bouton Add passkey."
			/>
			<p class="objective">Objectif&nbsp;: accepter la prochaine passkey.</p>
			<p class="bonus">Bonus&nbsp;: une 2ᵉ passkey, sur un autre support.</p>
		</section>
		<section class="fragment">
			<p class="eyebrow">Mission développeur</p>
			<img
				src={conditionalUi}
				alt="Champ d'identifiant et liste de comptes proposés pour se connecter avec une passkey."
			/>
			<p class="objective">Objectif&nbsp;: des passkeys dans votre app.</p>
			<p class="bonus">Bonus&nbsp;: retirer le mot de passe.</p>
		</section>
	</div>

	<SpeakerNotes>
		<p>La partie est finie, mais de nouvelles missions sont disponibles.</p>
		<p>
			[Utilisateur.] La prochaine fois qu'un site vous propose une passkey, comme GitHub ici,
			acceptez-la. Vous savez maintenant ce qu'il y a derrière ce bouton. Bonus : enregistrez-en une
			seconde, sur un autre support.
		</p>
		<p>
			[Développeur.] Vous avez toutes les clés pour proposer des passkeys dans vos apps : commencez
			par les ajouter à côté du mot de passe. Bonus, pour les plus courageux : la mission 4, sans
			mot de passe.
		</p>
		<p>
			L'illustration développeur est une image générée (comptes fictifs), reprise de BDXIO. La
			capture GitHub date de 2023 :
			https://github.blog/news-insights/product-news/passkeys-are-generally-available/
		</p>
	</SpeakerNotes>
</Slide>

<style>
	/*  Missions centrées verticalement dans l'espace sous le titre  */
	:global(main.slyd .slyd-slide:has(> .missions)) {
		display: flex;
		flex-direction: column;
	}

	.missions {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 80px;
		margin: auto 40px;

		section {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 20px 32px 28px;
			border: 6px solid var(--night-silhouette);
			box-shadow: 10px 12px 0 var(--night-silhouette);
			background: #fff;

			&:first-child {
				rotate: -1deg;
			}

			&:last-child {
				rotate: 1deg;
			}
		}
	}

	.eyebrow {
		margin: 0 0 16px;
		font-family: var(--slyd-headings-font), sans-serif;
		font-size: 40px;
		text-transform: uppercase;
		color: var(--slyd-headings-color);
	}

	img {
		display: block;
		height: 380px;
		max-width: 100%;
		object-fit: contain;
	}

	.objective {
		margin: 24px 0 0;
		font-size: 32px;
		font-weight: 600;
		text-align: center;
	}

	.bonus {
		margin: 12px 0 0;
		padding: 2px 20px;
		background: var(--sunset-yellow);
		font-size: 28px;
		font-weight: 600;
	}
</style>
