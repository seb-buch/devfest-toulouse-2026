<script lang="ts">
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
</script>

<Slide>
	<h3>Par où commencer&nbsp;?</h3>

	<ol class="route">
		<li>
			<span class="number">1</span>
			<h4>Ajouter les passkeys</h4>
			<p>Sur les comptes existants, à côté du mot de passe.</p>
		</li>
		<li class="fragment">
			<span class="number">2</span>
			<h4>Les proposer sans friction</h4>
			<p>Après une connexion par mot de passe&nbsp;:</p>
			<code>create(&#123; mediation: 'conditional' &#125;)</code>
		</li>
		<li class="fragment">
			<span class="number">3</span>
			<h4>Nouveaux comptes sans mot de passe</h4>
			<p>Le compte naît avec sa passkey.</p>
		</li>
		<li class="fragment">
			<span class="number">4</span>
			<h4>Retirer le mot de passe</h4>
			<p>Quand les passkeys et la récupération sont prêtes.</p>
		</li>
	</ol>

	<SpeakerNotes>
		<p>
			Vous avez sans doute une app avec des mots de passe, pas une page blanche. Pas besoin de tout
			casser : c'est le chemin de nos missions.
		</p>
		<p>[1.] Ajouter les passkeys aux comptes existants : c'est la mission 3. Rien n'est retiré.</p>
		<p>
			[2.] Le plus dur, c'est l'adoption. La création conditionnelle aide : juste après une
			connexion par mot de passe, le site appelle create() avec mediation « conditional ». Le
			gestionnaire de mots de passe peut alors créer la passkey sans fenêtre, et prévient
			l'utilisateur après coup. Chrome desktop depuis la 136, Chrome Android depuis la 142, Safari
			depuis la 18 (iOS 18, macOS 15). Ça dépend aussi du gestionnaire : on ignore silencieusement
			les erreurs. Penser à annuler l'autocomplétion en cours (get conditionnel) avant.
		</p>
		<p>[3.] Les nouveaux comptes naissent avec une passkey, sans mot de passe : la mission 4.</p>
		<p>
			[4.] Et un jour, on retire le mot de passe. Pas avant d'avoir une gestion des passkeys et une
			récupération solides.
		</p>
		<p>
			Sources : https://developer.chrome.com/docs/identity/webauthn-conditional-create et
			https://www.corbado.com/blog/ios-18-passkeys-automatic-passkey-upgrades
		</p>
	</SpeakerNotes>
</Slide>

<style>
	/*  Frise centrée verticalement dans l'espace sous le titre  */
	:global(main.slyd .slyd-slide:has(> .route)) {
		display: flex;
		flex-direction: column;
	}

	.route {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 40px;
		margin: auto 0;
		padding: 0;
		list-style: none;
		text-align: left;

		/*  Tracé GPS qui relie les étapes  */
		background: linear-gradient(var(--sunset-pink), var(--sunset-pink)) 0 30px / 100% 10px no-repeat;

		li {
			display: flex;
			flex-direction: column;
			gap: 14px;
		}
	}

	.number {
		display: grid;
		place-items: center;
		width: 70px;
		height: 70px;
		border: 5px solid var(--night-silhouette);
		border-radius: 50%;
		background: var(--sunset-yellow);
		font-family: var(--slyd-headings-font), sans-serif;
		font-size: 36px;
	}

	h4 {
		margin: 12px 0 0;
		font-size: 38px;
		line-height: 1.2;
		color: var(--slyd-headings-color);
	}

	p {
		margin: 0;
		font-size: 30px;
		line-height: 1.4;
	}

	code {
		font-size: 24px;
	}
</style>
