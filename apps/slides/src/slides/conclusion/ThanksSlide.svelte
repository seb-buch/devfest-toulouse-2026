<script lang="ts">
	import { QRCode, Slide, SpeakerNotes } from '@seb-buch/slyd';
	import photo from '#lib/assets/slides/sebastien-buchoux.jpg';
	import onepointLogo from '#lib/assets/slides/onepoint_logo.png';
	import githubIcon from '#lib/assets/icons/brands/github.svg';
	import linkedinIcon from '#lib/assets/icons/brands/linkedin.svg';

	const links = [
		{ icon: githubIcon, label: 'seb-buch', href: 'https://github.com/seb-buch', site: 'GitHub' },
		{
			icon: linkedinIcon,
			label: 'sebastien-buchoux',
			href: 'https://www.linkedin.com/in/sebastien-buchoux/',
			site: 'LinkedIn'
		}
	];
</script>

<Slide>
	<div class="layout">
		<div class="who-i-am">
			<img class="portrait" src={photo} alt="Sébastien Buchoux" />
			<p class="name">Sébastien Buchoux</p>
			<p class="role">Tech Lead / Architecte Logiciel</p>
			<img class="company" src={onepointLogo} alt="Onepoint" />
			{#each links as link (link.href)}
				<a
					class="social-link"
					href={link.href}
					target="_blank"
					rel="external noreferrer"
					aria-label="{link.site} : {link.label}"
				>
					<span class="social-icon" style:mask-image={`url("${link.icon}")`} aria-hidden="true"
					></span>
					{link.label}
				</a>
			{/each}
		</div>

		<div class="thanks">
			<h1 class="logo">Merci&nbsp;!</h1>
			<p>Questions&nbsp;?</p>
		</div>

		<div class="resources">
			<QRCode
				url="https://seb-buch.github.io/devfest-toulouse-2026/"
				size="360px"
				legend="Diapos / Repo / Feedback"
			/>
			<p>
				Pour aller plus loin<br />
				<a href="https://www.w3.org/TR/webauthn-3/" target="_blank" rel="external noreferrer"
					>Spécification WebAuthn 3</a
				><br />
				<a href="https://passkeys.dev/" target="_blank" rel="external noreferrer">passkeys.dev</a>
			</p>
		</div>
	</div>

	<SpeakerNotes>
		<p>
			Merci pour votre attention. Si vous avez des questions, c'est le moment. Et n'hésitez pas à
			venir me voir après la session.
		</p>
		<p>
			Le QR code mène à la page qui regroupe les diapos, le dépôt avec les apps de démo, et le
			formulaire de feedback.
		</p>
	</SpeakerNotes>
</Slide>

<style>
	.layout {
		display: grid;
		grid-template-columns: 500px 1fr 500px;
		align-items: center;
		gap: 40px;
		height: 100%;
		text-align: center;
	}

	.who-i-am,
	.resources {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 18px;
	}

	.portrait {
		width: 250px;
		height: 250px;
		border: 6px solid var(--night-silhouette);
		border-radius: 50%;
		box-shadow: 8px 10px 0 var(--night-silhouette);
		object-fit: cover;
	}

	.name {
		margin: 8px 0 0;
		font-size: 42px;
		font-weight: 700;
		color: var(--slyd-headings-color);
	}

	.role {
		margin: 0;
		font-size: 28px;
	}

	.company {
		width: 200px;
		margin: 8px 0;
	}

	a {
		font-size: 26px;
		color: var(--slyd-accent-color);
		text-underline-offset: 5px;
	}

	.social-link {
		display: inline-flex;
		align-items: center;
		gap: 14px;
	}

	.social-icon {
		width: 30px;
		height: 30px;
		background: currentColor;
		mask: center / contain no-repeat;
	}

	/*  Même style que « Mission accomplie » (MissionPassedSlide) : clin d'œil à l'écran de fin de mission  */
	.logo {
		margin: 0;
		font-family: 'Pricedown', sans-serif;
		font-size: 160px;
		line-height: 1;
		text-transform: none;
		color: var(--sunset-yellow);
		text-shadow:
			0 0 4px #000,
			4px 5px 0 #000;
	}

	.thanks p {
		margin: 40px 0 0;
		font-size: 56px;
		font-weight: 600;
	}

	.resources {
		:global(figure) {
			margin: 0;
		}

		:global(figcaption) {
			margin-top: 16px;
			font-size: 28px;
		}

		p {
			margin: 16px 0 0;
			font-size: 28px;
			font-weight: 700;
			line-height: 1.6;
		}
	}
</style>
