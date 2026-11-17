<script lang="ts">
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
	import MiniCeremony from '#lib/components/options/MiniCeremony.svelte';
	import OptionCard from '#lib/components/options/OptionCard.svelte';
</script>

<Slide>
	<h3>Découvrable, concrètement</h3>

	<div class="rows">
		<!--  Enregistrement : residentKey agit à la création de la paire  -->
		<section class="row">
			<MiniCeremony highlight={[3]} kind="registration" labels={{ 3: 'Paire + compte stockés' }} />
			<OptionCard
				moment="À l'enregistrement"
				name="residentKey"
				values={[
					{ value: 'required', label: 'découvrable obligatoire', chosen: true },
					{ value: 'preferred', label: 'découvrable si possible' },
					{ value: 'discouraged', label: 'plutôt non découvrable' }
				]}
			>
				<p class="w3c">
					W3C&nbsp;:
					<mark>« stored in the authenticator or client platform »</mark>
				</p>
			</OptionCard>
		</section>

		<!--  Authentification : allowCredentials part dans les options du serveur  -->
		<section class="row fragment" data-fragment-index="0">
			<MiniCeremony highlight={[1]} kind="authentication" />
			<OptionCard
				moment="À l'authentification"
				name="allowCredentials"
				values={[
					{ value: '[]', label: "l'authentificateur propose les passkeys du site", chosen: true },
					{ value: '[…]', label: 'limité aux credentials listés' }
				]}
			>
				<p class="w3c">
					W3C&nbsp;:
					<mark>« does not provide any credential IDs »</mark>
				</p>
			</OptionCard>
		</section>
	</div>

	<SpeakerNotes>
		Alors pour les deux cérémonies, je vous ai parlé d'options. On va voir un petit peu ces options.
		Et avant même d'avoir parlé de ces options, je parlais d'un credential qui est découvrable.
		Qu'est-ce que ça veut dire découvrable concrètement ? Ça va passer par des options. Et à
		l'enregistrement, le serveur va envoyer une option qui s'appelle Resident Key, qui va pouvoir
		prendre différentes valeurs, soit required, soit preferred, soit discouraged, par Les bonnes
		pratiques demandent à ce qu'on fasse une ResidentKey qui soit nécessaire, donc découvrable de
		manière obligatoire, c'est ce qu'il y a dans la définition W3C. Et ça, ça va imposer le fait que
		l'authentificateur peut lister les credentials associés à un site, même s'il n'y a pas de
		username associé avec ce site. C'est pour ça qu'on parle de découvrable. L'autre, donc ça
		c'était pour l'enregistrement, à l'authentification, on a une autre option qui s'appelle
		AllowCredentials qui va permettre au serveur de donner une liste de clés d'accès qui sont
		valides. Et dans ce cas-là, si on fournit une liste, l'authentificateur ne va renvoyer les clés
		d'accès que si elles font partie de cette liste-là. Ce n'est pas l'option par défaut, l'option
		par défaut c'est de dire à l'authentificateur renvoie-moi toutes les credentials qui
		correspondent à ce site. Là encore, c'est dans la définition et dans les recommandations W3C
		pour permettre d'avoir une expérience un peu lisse et ne pas bloquer les gens parce qu'ils ont,
		par exemple, oublié leur username.
	</SpeakerNotes>
</Slide>

<style>
	.rows {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		margin-top: 2em;
		gap: 2em;
	}

	.row {
		display: flex;
		align-items: center;
		justify-content: space-around;
	}

	.w3c {
		padding-top: 1em;
		font-size: 22px;
		font-style: italic;

		mark {
			padding: 0 4px;
			background: var(--sunset-yellow);
			font-weight: 600;
		}
	}
</style>
