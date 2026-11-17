<script lang="ts">
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
	import MiniCeremony from '#lib/components/options/MiniCeremony.svelte';
	import OptionCard from '#lib/components/options/OptionCard.svelte';
</script>

<Slide>
	<h3>Et trois réglages de plus</h3>

	<div class="row">
		<!--  Les trois options partent avec les options d'enregistrement  -->
		<MiniCeremony
			highlight={[1, 3, 4]}
			kind="registration"
			labels={{ 3: 'Algorithme · doublon ?', 4: 'Clé publique + attestation' }}
		/>

		<div class="options">
			<OptionCard
				name="pubKeyCredParams"
				values={[
					{ value: '-48', label: 'ML-DSA-44', badge: 'Post-quantique' },
					{ value: '-8', label: 'Ed25519' },
					{ value: '-7', label: 'ES256' },
					{ value: '-257', label: 'RS256' }
				]}
			>
				<p>L'authentificateur prend le premier qu'il prend en charge.</p>
			</OptionCard>

			<div class="fragment">
				<OptionCard
					name="excludeCredentials"
					values={[
						{ value: '[…]', label: 'les passkeys du compte', chosen: true },
						{ value: '[]', label: 'par défaut : rien d’exclu' }
					]}
				>
					<p>Déjà une passkey du compte&nbsp;? L'authentificateur refuse.</p>
				</OptionCard>
			</div>

			<div class="fragment">
				<OptionCard
					name="attestation"
					values={[
						{ value: 'none', label: 'pas d’attestation demandée', chosen: true },
						{ value: 'indirect', label: 'attestation, intermédiaire autorisé' },
						{ value: 'direct', label: 'attestation de l’authentificateur' },
						{ value: 'enterprise', label: 'identification en environnement géré' }
					]}
				>
					<p>Prouve le <strong>modèle</strong> de l'authentificateur, pas l'utilisateur.</p>
				</OptionCard>
			</div>
		</div>
	</div>

	<SpeakerNotes>
		Et pour finir, on va parler des trois options qui sont un peu moins importantes, mais néanmoins
		qui sont nécessaires. La première, c'est le type d'algorithme qui va être utilisé pour chiffrer
		les clés. Et donc ça, c'est une option qui est passée par le serveur qui va dire moi je vais
		supporter cet algorithme là ou celui-là, et donc il va passer une liste d'algorithmes et
		l'authentificateur va prendre le premier dans la liste qu'il prend en charge pour être sûr que
		les deux puissent échanger des clés que l'autre puisse comprendre. Je vous ai mis une liste là
		qui est non exhaustive. Concrètement, l'algorithme il est identifié par sont par un numéro, donc
		ici moins 48 pour le premier qui correspond à l'algorithme ML DSA44 qui se trouve être un
		algorithme post-quantique. Donc les clés d'accès, si vous utilisez cet algorithme, seront même
		utilisables une fois que l'ordinateur quantique aura craqué tous les chiffrements basés sur les
		nombres premiers. On n'y est pas encore. Et j'ai mis aussi la liste un peu plus classique. Moins
		8, c'est ED25519, donc ça c'est un algorithme classique de chiffrement, moins 7, ES256, etc.
		Donc ça c'est vraiment associé en général à la bibliothèque qu'on va utiliser côté serveur pour
		pour le chiffrement. Une autre option, c'est Exclude Credentials qui va permettre au serveur de
		dire moi je connais ces clés d'accès, si elles sont déjà présentes, n'en crée pas plus et
		refuse. Donc si l'authentificateur a déjà cette clé associée à ce compte, il va refuser la
		création d'une clé. par défaut et en particulier quand on c'est le cas quand typiquement on
		enregistre sa première clé d'accès il n'y a rien et donc on va passer une liste vide et on va
		exclure aucune des clés et quelque chose qui a assez peu d'intérêt pour le grand public c'est
		l'attestation l'attestation chiffrée enfin en termes de cryptographie l'attestation de
		l'authentificateur la recommandation W3C c'est de ne pas demander d'attestation Et dans ce
		cas-là, on va faire confiance à n'importe quel authentificateur qui nous donne des clés. Si on
		veut sécuritiser les choses et si on est dans un environnement très sécurisé, on va pouvoir
		demander des attestations de manière plus ou moins permissive. Et ça, ça va prouver que
		l'authentificateur a le droit de générer des clés d'accès pour cet utilisateur et pour ce site.
	</SpeakerNotes>
</Slide>

<style>
	.row {
		display: flex;
		align-items: center;
		gap: 60px;
		margin-top: 1em;
	}

	.options {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}
</style>
