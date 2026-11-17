<script lang="ts">
	import { Slide, SpeakerNotes, VerticalSpacer } from '@seb-buch/slyd';
</script>

<Slide>
	<h3>Au fait, c'est quoi une <em>passkey</em>&nbsp;?</h3>

	<VerticalSpacer height="3em" />
	<ul class="aliases">
		<li class="main">Passkey</li>
		<li>Client-side discoverable Public Key Credential Source</li>
		<li>Client-side discoverable Credential</li>
		<li>Discoverable Credential</li>
		<li class="deprecated">Resident Credential</li>
		<li class="deprecated">Resident Key</li>
	</ul>

	<VerticalSpacer height="2em" />
	<blockquote class="w3c">
		<p>
			<b>A Client-side discoverable Public Key Credential Source</b> […] is a public key credential
			source that is discoverable and usable in authentication ceremonies where the Relying Party
			does not provide any credential IDs, i.e., the Relying Party invokes
			<code>navigator.credentials.get()</code>
			with an empty allowCredentials argument. This means that the Relying Party does not necessarily
			need to first identify the user.
		</p>
		<p>
			As a consequence, a discoverable credential capable authenticator can generate an assertion
			signature for a discoverable credential given only an RP ID, which in turn necessitates that
			the public key credential source is stored in the authenticator or client platform . This is
			in contrast to a Server-side Public Key Credential Source, which requires that the
			authenticator is given both the RP ID and the credential ID but does not require client-side
			storage of the public key credential source.
		</p>
		<cite>
			<a
				href="https://w3c.github.io/webauthn/#client-side-discoverable-credential"
				rel="noreferrer"
				target="_blank">W3C — Spécification WebAuthn</a
			>
		</cite>
	</blockquote>

	<VerticalSpacer height="2em" />

	<p class="de-facto fragment custom" data-fragment-index="0">
		Une <em>passkey</em> est un credential <strong>WebAuthn découvrable</strong>, associé à un
		compte et à un site, qui permet de s'authentifier avec une paire de clés.
	</p>

	<SpeakerNotes>
		Alors justement, c'est WebAuthn qui définit ce que c'est une passkey et l'appelle même de
		différentes façons. Vous avez passkey, client side discoverable public key credential source,
		etc. Il y a même deux noms, Resident Credential et Resident Key, qui sont considérées comme
		obsolète. Ça c'est pour le nom. Pour la définition, je vous l'ai mis en dessous. Alors vous
		voyez que c'est un gros pavé en anglais. Si on se contente de résumer tout ça en français, ça
		nous donne qu'une clé d'accès, c'est un credential Webauthn découvrable, associé à un compte et
		à un site qui permet de s'authentifier avec une paire de clés.
	</SpeakerNotes>
</Slide>

<style>
	h3 em {
		font-style: normal;
		color: var(--slyd-main-color);
	}

	/*  Alias : étiquettes, la passkey en jaune  */
	.aliases {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 14px 22px;
		margin: 0;
		padding: 0;
		list-style: none;
		font-size: 32px;
		font-weight: 600;

		li {
			padding: 0 14px;
			border: 4px solid var(--night-silhouette);
			box-shadow: 5px 6px 0 var(--night-silhouette);
			background: #fff;
		}

		.main {
			background: var(--sunset-yellow);
			text-transform: uppercase;
		}

		.deprecated {
			opacity: 0.6;
			text-decoration: line-through 3px;
		}
	}

	/*  Définition W3C : cartouche, extraits clés surlignés  */
	.w3c {
		margin: 36px 24px 0;
		padding: 18px 30px 12px;
		border: 6px solid var(--night-silhouette);
		box-shadow: 10px 12px 0 var(--night-silhouette);
		background: #fff;
		rotate: -0.5deg;
		font-size: 25px;
		font-style: italic;
		line-height: 1.45;

		p {
			margin: 0 0 12px;
		}

		cite {
			display: block;
			font-size: 20px;
			text-align: right;

			a {
				color: var(--slyd-accent-color);
			}
		}
	}

	/*  Définition pratique : révélée après la définition officielle  */
	.de-facto {
		margin: 36px 60px 0;
		font-size: 36px;
		font-weight: 600;
		line-height: 1.35;
		text-align: center;
		opacity: 0;
		transition: opacity 0.4s ease;

		&:global(.revealed) {
			opacity: 1;
		}

		em {
			font-style: normal;
			color: var(--slyd-headings-color);
		}

		strong {
			color: var(--slyd-headings-color);
		}
	}
</style>
