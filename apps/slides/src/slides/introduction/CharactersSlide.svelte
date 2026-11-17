<script lang="ts">
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
	import gta_couple from '#lib/assets/slides/lucia_jason.webp';
	import pres_couple from '#lib/assets/slides/alice-bob.webp';
	import gtaLogo from '#lib/assets/slides/backgrounds/gta-logo.webp';
	import viLogo from '#lib/assets/slides/backgrounds/VI.webp';
	import GameTitle from '#lib/components/GameTitle.svelte';
</script>

<!--  GTA VI vs GTA: Passkeys City : le logo de chaque jeu au-dessus de son couple de héros  -->
<Slide>
	<div class="character-wrapper">
		<div class="game gta">
			<div class="logo vi-logo">
				<img alt="" src={viLogo} />
				<img alt="Grand Theft Auto VI" class="vi-title" src={gtaLogo} />
			</div>
			<figure class="polaroid">
				<img alt="Lucia et Jason" src={gta_couple} />
				<figcaption>
					<span class="names">Lucia & Jason</span>
					<span class="role">Gangsters</span>
					<span class="goal">Réussir le coup du siècle</span>
				</figcaption>
			</figure>
		</div>
		<div class="game devfest fragment">
			<div class="logo">
				<GameTitle height={180} />
			</div>
			<figure class="polaroid">
				<img alt="Alice et Bob" src={pres_couple} />
				<figcaption>
					<span class="names">Alice & Bob</span>
					<span class="role">Devs</span>
					<span class="goal">Maîtriser les passkeys</span>
				</figcaption>
			</figure>
		</div>
	</div>
	<SpeakerNotes>
		C'est vrai qu'il y a quelques différences avec le GTA que vous attendiez, puisque dans celui-là,
		on a Lucia et Jason qui sont des gangsters et qui, si on résume les choses, veulent réussir le
		coup du siècle. Alors que dans notre GTA, on va avoir Alice et Bob, ces deux devs, et leur but,
		c'est de maîtriser les passkeys.
	</SpeakerNotes>
</Slide>

<style>
	.character-wrapper {
		display: flex;
		justify-content: center;
		align-items: flex-start;
		gap: 200px;
		height: 100%;
		padding-top: 24px;
	}

	.game {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 48px;
	}

	/*  Logos de même hauteur au-dessus des polaroïds  */
	.logo {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 180px;
	}

	/*  GTA VI : « grand theft auto » posé au centre du VI  */
	.vi-logo {
		position: relative;

		img {
			height: 100%;
		}

		.vi-title {
			position: absolute;
			height: 65%;
		}
	}

	/*  Cadre polaroïd : bandeau du bas plus épais pour la légende manuscrite  */
	.polaroid {
		position: relative;
		margin: 0;
		padding: 24px 24px 0;
		background: #fff;
		box-shadow: 0 18px 40px rgb(26 21 48 / 0.28);

		img {
			display: block;
			height: 500px;
			background: #fff;
			outline: 1px solid rgb(26 21 48 / 0.08);
		}

		figcaption {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 16px 0 20px;
		}
	}

	.gta {
		--tilt: -4deg;
		transition: filter 0.3s;
	}

	.devfest {
		--tilt: 3deg;
	}

	/*  Polaroïd « posé » sur la diapo : à l'arrivée sur la diapo, ou quand le fragment est révélé  */
	.polaroid {
		rotate: var(--tilt);
	}

	:global(.slyd-slide.current) .gta .polaroid,
	.devfest:global(.revealed) .polaroid {
		animation: drop 0.5s ease-out;
	}

	@keyframes drop {
		from {
			opacity: 0;
			scale: 1.15;
			rotate: calc(var(--tilt) * 3);
		}
		60% {
			opacity: 1;
			scale: 0.98;
		}
		to {
			scale: 1;
			rotate: var(--tilt);
		}
	}

	/*  Écran de mort GTA : GTA VI se désature une fois Alice et Bob arrivés  */
	.character-wrapper:has(:global(.devfest.revealed)) .gta {
		filter: grayscale(0.7) brightness(0.85);
	}

	.names {
		font-family: 'Permanent Marker', cursive;
		font-size: 56px;
		line-height: 1.1;
	}

	.role {
		font-size: 24px;
		color: rgb(26 21 48 / 0.65);
	}

	.goal {
		font-size: 28px;
		font-weight: 600;
		color: var(--slyd-accent-color);
	}
</style>
