<script lang="ts">
	import { Code, Slide, SpeakerNotes } from '@seb-buch/slyd';
	import CodePanel from '#lib/components/code/CodePanel.svelte';
	import CryptoKey from '#lib/components/cryptography/CryptoKey.svelte';
	import { apiAvailable } from '#lib/api.ts';
	import wellKnown from './code/well-known-webauthn.json?raw';

	const RP_ID = 'gta-passkeys-city.demo';
	const RELATED_ORIGIN = 'https://devfest-toulouse-2026.demo';

	/*  Origines qui demandent une passkey de RP_ID ; la dernière bascule grâce au .well-known  */
	const origins = [
		{ origin: `https://${RP_ID}`, verdict: 'accepted' },
		{ origin: `https://app.${RP_ID}`, verdict: 'accepted' },
		{ origin: `https://${RP_ID}.evil.com`, verdict: 'rejected' },
		{ origin: RELATED_ORIGIN, verdict: 'related' }
	];
</script>

<Slide>
	<h3>BONUS&nbsp;: Un domaine… ou plusieurs</h3>

	<div class="domains">
		<div class="origins-column">
			<p class="rp-id">
				<span class="label">RP ID</span>
				<CryptoKey size="56" type="private" />
				<code>{RP_ID}</code>
			</p>

			<ul class="origins">
				{#each origins as { origin, verdict } (origin)}
					<li class={['fragment', verdict]}>
						<span class="verdict" aria-hidden="true">
							<span class="no">✕</span><span class="yes">✓</span>
						</span>
						<code>{origin}</code>
					</li>
				{/each}
			</ul>
		</div>

		<div class="well-known fragment">
			<CodePanel title="https://{RP_ID}/.well-known/webauthn">
				<Code lang="json" theme="github-light-high-contrast">{wellKnown.trim()}</Code>
			</CodePanel>
		</div>
	</div>

	<!--  Démo live : le fichier publié, puis la connexion depuis l'origine liée  -->
	{#if apiAvailable}
		<p class="fragment demo">
			<a
				class="demo-button"
				href="https://{RP_ID}/.well-known/webauthn"
				rel="noreferrer"
				target="_blank">Voir <code>/.well-known/webauthn</code>&nbsp;↗</a
			>
			<a class="demo-button" href="{RELATED_ORIGIN}/" rel="noreferrer" target="_blank"
				>Se connecter depuis <code>{RELATED_ORIGIN.replace('https://', '')}</code>&nbsp;↗</a
			>
		</p>
	{/if}

	<SpeakerNotes>
		<p>
			On m'a posé la question la dernière fois : que se passe-t-il si on change de nom de domaine ?
			Pour y répondre, revenons au RP ID. À la création, l'authentificateur enregistre la passkey
			avec le RP ID. À chaque connexion, le navigateur vérifie que l'origine de la page correspond :
			c'est ce qui rend la passkey résistante au phishing.
		</p>
		<p>
			[Origines.] Le domaine lui-même : oui. Un sous-domaine : oui, le RP ID est un suffixe de
			l'origine. Un domaine qui imite le nôtre : non, c'est tout l'intérêt. Et un autre domaine,
			même à nous : non plus, par défaut.
		</p>
		<p>
			Sous-domaines : le RP ID peut être le domaine de la page ou un domaine parent enregistrable.
			Choisissez le domaine enregistrable dès le premier jour : avec login.exemple.fr comme RP ID,
			les passkeys ne marcheront jamais sur app.exemple.fr. Piège : le RP ID par défaut d'une
			bibliothèque, c'est souvent le hostname de la page. Vérifiez-le.
		</p>
		<p>
			[.well-known.] Plusieurs domaines en même temps : un site par pays, une marque rachetée… Le RP
			ID principal publie la liste des origines autorisées à l'utiliser, à une adresse standard :
			/.well-known/webauthn. C'est Related Origin Requests. Sur devfest-toulouse-2026.demo, le site
			demande une passkey pour gta-passkeys-city.demo. L'origine ne correspond pas : le navigateur
			va lire la liste sur gta-passkeys-city.demo, y trouve devfest-toulouse-2026.demo, et la
			cérémonie continue. C'est le domaine principal qui décide, pas le site qui demande : evil.com
			ne peut pas s'ajouter lui-même.
		</p>
		<p>
			[Conclusion.] Ni le site, ni l'utilisateur ne peuvent modifier le RP ID d'une passkey. Le RP
			ID est un choix d'architecture : prenez un domaine stable. Et pour changer de domaine : le
			nouveau garde l'ancien RP ID et s'ajoute à la liste. C'est ce qu'on a fait :
			devfest-toulouse-2026.demo était le nom du site au départ.
		</p>
		<p>
			[Démo : ouvrir le lien.] Nouvel onglet, regardez la barre d'adresse :
			devfest-toulouse-2026.demo. Même app, autre domaine. [Se connecter avec la passkey créée tout
			à l'heure.] Connecté : ma passkey de gta-passkeys-city.demo marche ici. Côté serveur, deux
			lignes : le fichier .well-known et l'origine ajoutée à la liste des origines acceptées.
			[Revenir aux slides.]
		</p>
		<p>
			Limites : au plus 5 « labels », le nom avant le suffixe public. exemple.de et exemple.co.uk
			comptent pour un seul label, exemple. Support : Chrome et Edge depuis la 128 (août 2024),
			Safari depuis la 18. Firefox : à vérifier avant le talk (web.dev disait en janvier 2026 que
			Mozilla étudiait la fonction ; un article annonce Firefox 152, sans source officielle).
			Détection : PublicKeyCredential.getClientCapabilities(), capacité relatedOrigins, avec un
			repli : rediriger vers le domaine principal pour se connecter.
		</p>
		<p>
			Apps natives : même principe de fichier .well-known, côté applications. assetlinks.json pour
			Android, apple-app-site-association (webcredentials) pour iOS : l'app déclare le site, le site
			déclare l'app, et l'app utilise les passkeys du site.
		</p>
		<p>
			Préparation : démo dans Chrome, devfest-toulouse-2026.demo dans /etc/hosts, passkey créée
			pendant les démos précédentes.
		</p>
		<p>
			Sources : https://web.dev/articles/webauthn-related-origin-requests,
			https://passkeys.dev/docs/advanced/related-origins/ et
			https://w3c.github.io/webauthn/#sctn-related-origins
		</p>
	</SpeakerNotes>
</Slide>

<style>
	.domains {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 80px;
		margin-top: 60px;
	}

	.rp-id {
		display: flex;
		align-items: center;
		gap: 16px;
		margin: 0 0 40px;
		font-size: 34px;

		.label {
			font-family: var(--slyd-headings-font), sans-serif;
			text-transform: uppercase;
			color: var(--slyd-headings-color);
		}

		code {
			padding: 4px 16px;
			background: var(--sunset-yellow);
			border: 4px solid var(--night-silhouette);
			box-shadow: 6px 8px 0 var(--night-silhouette);
		}
	}

	.origins {
		display: flex;
		flex-direction: column;
		gap: 24px;
		margin: 0;
		padding: 0;
		list-style: none;
		font-size: 30px;

		li {
			display: flex;
			align-items: center;
			gap: 20px;
		}
	}

	/*  Pastille ✓ / ✕ : la ligne « related » passe à ✓ quand le .well-known apparaît  */
	.verdict {
		display: grid;
		place-items: center;
		width: 52px;
		height: 52px;
		border: 4px solid var(--night-silhouette);
		border-radius: 50%;
		font-weight: 700;
		color: #fff;
		background: var(--slyd-accent-color);
		transition: background-color 0.3s;

		.yes {
			display: none;
		}
	}

	.accepted .verdict,
	.domains:has(.well-known:global(.revealed)) .related .verdict {
		color: var(--night);
		background: var(--vice-teal);

		.no {
			display: none;
		}

		.yes {
			display: inline;
		}
	}

	.domains:has(.well-known:global(.revealed)) .related code {
		background: var(--sunset-yellow);
	}

	.demo {
		display: flex;
		justify-content: center;
		gap: 40px;
		margin: 80px 0 0;
	}

	/*  Bouton dans le style du cartouche RP ID : bordure et ombre portée  */
	.demo-button {
		padding: 12px 28px;
		border: 4px solid var(--night-silhouette);
		box-shadow: 6px 8px 0 var(--night-silhouette);
		background: var(--slyd-accent-color);
		font-size: 32px;
		font-weight: 600;
		color: #fff;
		text-decoration: none;

		code {
			color: inherit;
		}
	}
</style>
