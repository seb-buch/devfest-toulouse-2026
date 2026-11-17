<script lang="ts">
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';

	const supports = [
		{ name: 'Gestionnaire A', example: 'iCloud Keychain' },
		{ name: 'Gestionnaire B', example: 'Google, 1Password…' },
		{ name: 'Clé de sécurité', example: 'rangée en lieu sûr' }
	];
</script>

<Slide>
	<h3>Trousseau perdu&nbsp;?</h3>

	<div class="lost-layout">
		<p class="problem">Plus de passkey accessible… <strong>plus d'accès au compte</strong>.</p>

		<div class="fragment precaution">
			<p class="eyebrow">Côté utilisateur</p>
			<div class="supports">
				{#each supports as support, index (support.name)}
					{#if index > 0}<span class="plus" aria-hidden="true">+</span>{/if}
					<div class="support">
						<strong>{support.name}</strong>
						<span>{support.example}</span>
					</div>
				{/each}
			</div>
			<p class="takeaway">Plusieurs passkeys, sur des supports indépendants.</p>
		</div>

		<div class="fragment precaution">
			<p class="eyebrow">Côté site</p>
			<p class="takeaway">Prévoir une <strong>récupération du compte</strong>.</p>
		</div>
	</div>

	<SpeakerNotes>
		<p>
			Sans mot de passe, la question qui revient toujours : et si je perds mes passkeys ? Si je n'ai
			plus accès à aucune, je ne peux plus me connecter.
		</p>
		<p>
			[Côté utilisateur.] La précaution : plusieurs passkeys sur des supports indépendants. Deux
			appareils synchronisés par le même gestionnaire, c'est une seule passkey : si je perds l'accès
			au gestionnaire, je perds les deux. Une clé de sécurité rangée en lieu sûr, c'est un vrai
			secours. Le site doit permettre d'ajouter plusieurs passkeys : c'est ce qu'on a vu.
		</p>
		<p>
			[Côté site.] Mais on ne peut pas compter uniquement sur la prudence des utilisateurs. Le site
			doit prévoir une récupération. Voyons celle de notre app.
		</p>
		<p>Source : https://www.w3.org/TR/webauthn-3/#sctn-credential-loss</p>
	</SpeakerNotes>
</Slide>

<style>
	/*  Problème et précautions répartis sur toute la hauteur sous le titre  */
	:global(main.slyd .slyd-slide:has(> .lost-layout)) {
		display: flex;
		flex-direction: column;
	}

	.lost-layout {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		padding-bottom: 40px;
	}

	.problem {
		margin: 0;
		font-size: 44px;
		text-align: center;
	}

	.precaution {
		text-align: center;
	}

	.eyebrow {
		margin: 0 0 16px;
		font-family: var(--slyd-headings-font), sans-serif;
		font-size: 34px;
		text-transform: uppercase;
		color: var(--slyd-headings-color);
	}

	.supports {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 32px;
	}

	.support {
		display: flex;
		flex-direction: column;
		width: 380px;
		padding: 16px 24px;
		border: 5px solid var(--night-silhouette);
		box-shadow: 8px 10px 0 var(--night-silhouette);
		background: #fff;

		strong {
			font-size: 34px;
		}

		span {
			font-size: 26px;
		}

		&:nth-of-type(odd) {
			rotate: -1deg;
		}

		&:nth-of-type(even) {
			rotate: 1deg;
		}
	}

	.plus {
		font-family: var(--slyd-headings-font), sans-serif;
		font-size: 60px;
		color: var(--sunset-orange);
	}

	.takeaway {
		margin: 24px 0 0;
		font-size: 38px;
		font-weight: 600;
	}
</style>
