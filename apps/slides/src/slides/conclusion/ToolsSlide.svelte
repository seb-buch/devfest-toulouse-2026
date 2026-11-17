<script lang="ts">
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
</script>

<Slide>
	<h3>Natif devant, bibliothèque derrière</h3>

	<div class="layout">
		<div class="sides">
			<section class="fragment">
				<h4>Navigateur</h4>
				<p class="verdict"><span class="count">0</span> bibliothèque</p>
				<ul>
					<li><code>create()</code> / <code>get()</code></li>
					<li><code>parse…OptionsFromJSON()</code>, <code>toJSON()</code></li>
				</ul>
			</section>
			<section class="fragment">
				<h4>Serveur</h4>
				<p class="verdict"><span class="count">1</span> bibliothèque éprouvée</p>
				<ul>
					<li>Extraire la clé publique</li>
					<li>Vérifier challenge, origine, signature</li>
				</ul>
			</section>
		</div>

		<p class="business fragment">
			À vous d'écrire&nbsp;: comptes, gestion des passkeys, récupération.
		</p>
	</div>

	<SpeakerNotes>
		<p>Tout ce qu'on a vu peut sembler beaucoup. Mais on n'écrit pas la cryptographie soi-même.</p>
		<p>
			[Navigateur.] Côté navigateur, zéro bibliothèque. create() et get() font la cérémonie, et les
			méthodes de conversion JSON, Baseline depuis 2025, remplacent ce que faisaient les
			bibliothèques front : convertir les octets en base64url. Bonus : getClientCapabilities dit ce
			que le navigateur sait faire : autocomplétion, Related Origins, création conditionnelle…
		</p>
		<p>
			[Serveur.] Côté serveur, c'est l'inverse : extraire la clé publique, vérifier le challenge,
			l'origine et la signature, c'est facile à rater et dangereux si on le rate. Une bibliothèque
			éprouvée s'en charge. On a utilisé SimpleWebAuthn. Il en existe dans tous les langages, la
			liste est en annexe.
		</p>
		<p>
			[Métier.] Ce qu'il reste à écrire, front et back, c'est le métier : les comptes, la gestion
			des passkeys (les enregistrer, les lister, les nommer, ne jamais supprimer la dernière) et la
			récupération. Exactement ce qu'on a vu dans la dernière mission. La checklist complète est en
			annexe des slides.
		</p>
	</SpeakerNotes>
</Slide>

<style>
	/*  Contenu centré verticalement dans l'espace sous le titre  */
	:global(main.slyd .slyd-slide:has(> .layout)) {
		display: flex;
		flex-direction: column;
	}

	.layout {
		margin-block: auto;
	}

	.sides {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 64px;
		margin-inline: 20px;
		text-align: left;

		section {
			padding: 24px 36px 28px;
			border: 6px solid var(--night-silhouette);
			box-shadow: 10px 12px 0 var(--night-silhouette);
			background: #fff;
		}
	}

	h4 {
		margin: 0;
		font-family: var(--slyd-headings-font), sans-serif;
		font-size: 32px;
		font-weight: 400;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--slyd-headings-color);
	}

	/*  Le verdict de chaque côté : la ligne qu'on lit en premier  */
	.verdict {
		margin: 4px 0 20px;
		font-family: var(--slyd-headings-font), sans-serif;
		font-size: 52px;
		line-height: 1.1;
		text-transform: uppercase;
	}

	.count {
		font-size: 88px;
		color: var(--slyd-accent-color);
	}

	ul {
		margin: 0;
		padding-left: 32px;
		font-size: 28px;
		line-height: 1.7;
	}

	/*  Ce qui reste à écrire, commun aux deux côtés  */
	.business {
		margin: 56px 0 0;
		font-size: 36px;
		font-weight: 600;
		text-align: center;
	}
</style>
