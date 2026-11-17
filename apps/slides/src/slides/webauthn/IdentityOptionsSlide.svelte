<script lang="ts">
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
	import MiniCeremony from '#lib/components/options/MiniCeremony.svelte';
	import OptionCard from '#lib/components/options/OptionCard.svelte';
</script>

<Slide>
	<h3>Un site, un compte</h3>

	<div class="rows">
		<!--  rp et user partent dans les options ; le navigateur contrôle rp.id  -->
		<section class="row">
			<MiniCeremony
				highlight={[1, 2]}
				kind="registration"
				labels={{ 1: 'Options : rp · user', 2: 'Vérifie RP ID ↔ origine' }}
			/>
			<OptionCard
				moment="Le site"
				name="rp"
				values={[
					{ value: 'id', label: 'domaine du site : la passkey ne servira que là' },
					{ value: 'name', label: 'nom affiché à l’utilisateur' }
				]}
			/>
		</section>

		<!--  user.id revient avec la signature : c'est le user handle  -->
		<section class="row fragment" data-fragment-index="0">
			<MiniCeremony
				highlight={[4]}
				kind="authentication"
				labels={{ 4: 'Signature · user handle' }}
			/>
			<OptionCard
				moment="Le compte"
				name="user"
				values={[
					{ value: 'id', label: 'octets aléatoires, jamais l’email' },
					{ value: 'name', label: 'identifiant affiché dans le sélecteur' },
					{ value: 'displayName', label: 'nom de la personne' }
				]}
			/>
		</section>
	</div>

	<SpeakerNotes>
		Quelque chose d'autre qui est aussi important dans la compréhension, c'est le fait qu'une clé
		d'accès est associée à un site et à un compte. Et ça, dans les options, c'est important parce
		que ça correspond au RP, donc pour un Relying Party, qui va être décomposé en RP ID, qui
		correspond ni plus ni moins qu'au nom de domaine auquel la passe key va être associée et à son
		nom RPName. qui est juste le nom affiché côté utilisateur. Donc ça c'est la première chose. Une
		clé d'accès va être associée à un site. Elle va également être associée à un utilisateur via un
		user handle qui va être complètement aléatoire. C'est un identifiant aléatoire généré et
		accroché à la clé d'accès, mais qui n'est pas forcément lié au... typiquement au numéro
		identifiant de l'utilisateur dans l'application. Les deux sont décorrélés. Et puis associé à ce
		user, on va avoir aussi un nom et un nom d'affichage.
	</SpeakerNotes>
</Slide>

<style>
	/*  Même disposition que residentKey / allowCredentials : une miniature et son option par ligne  */
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
</style>
