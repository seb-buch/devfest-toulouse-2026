<script lang="ts">
	import type { Snippet } from 'svelte';
	import ActorArtwork from '#lib/components/actors/ActorArtwork.svelte';
	import ActorIcon from '#lib/components/actors/ActorIcon.svelte';

	type Props = {
		/** Miniature : une icône seule par acteur, sans cartouche */
		mini?: boolean;
		children: Snippet;
	};

	const { mini = false, children }: Props = $props();

	/*  Illustrations de la slide FIDO2, en version compacte  */
	const ARTWORK_HEIGHT = 120;
	const ARTWORK_SCALE_BASE = 0.6;
	const ARTWORK_SCALE_NAVIGATOR = 0.9 * ARTWORK_SCALE_BASE;
	const ARTWORK_SCALE_AUTHENTICATOR = 1.5 * ARTWORK_SCALE_BASE;

	/*  Icônes des miniatures : assez grandes pour rester lisibles une fois réduites  */
	const ICON_SIZE = 150;
</script>

<!--  Cérémonie WebAuthn : les trois acteurs, leurs lignes de vie et les étapes  -->
<div class="ceremony">
	{#if mini}
		<div class="actors">
			<div class="icon"><ActorIcon actor="authenticator" size={ICON_SIZE} /></div>
			<div class="icon"><ActorIcon actor="browser" size={ICON_SIZE} /></div>
			<div class="icon"><ActorIcon actor="server" size={ICON_SIZE} /></div>
		</div>
	{:else}
		<div class="actors">
			<div class="actor authenticator">
				<ActorArtwork
					actor="authenticator"
					height={ARTWORK_HEIGHT}
					scale={ARTWORK_SCALE_AUTHENTICATOR}
				/>
				<span>Authentificateur</span>
			</div>
			<div class="actor browser">
				<ActorArtwork actor="browser" height={ARTWORK_HEIGHT} scale={ARTWORK_SCALE_NAVIGATOR} />
				<span>Navigateur</span>
			</div>
			<div class="actor server">
				<ActorArtwork actor="server" height={ARTWORK_HEIGHT} scale={ARTWORK_SCALE_BASE} />
				<span>Serveur</span>
			</div>
		</div>
	{/if}
	<div class="steps">
		{@render children()}
	</div>
</div>

<style>
	/*  Trois colonnes de 540px : les axes des acteurs sont à 270, 810 et 1350px  */
	.ceremony {
		width: 1620px;
		margin: 30px auto 0;
	}

	.actors {
		display: flex;
	}

	/*  Cartouches compacts : illustration et nom, comme sur la slide FIDO2  */
	.actor {
		width: 400px;
		margin: 0 70px;
		box-sizing: border-box;
		border: 6px solid var(--night-silhouette);
		box-shadow: 10px 12px 0 var(--night-silhouette);
		background: #fff;

		span {
			display: block;
			padding: 2px 0 4px;
			font-family: var(--slyd-headings-font), sans-serif;
			font-size: 40px;
			line-height: 1.2;
			text-align: center;
			text-transform: uppercase;
		}

		&.authenticator {
			rotate: -1.5deg;
		}

		&.browser {
			rotate: 1deg;
		}

		&.server {
			rotate: -1deg;
		}
	}

	/*  Miniature : icône centrée sur la ligne de vie de son acteur  */
	.icon {
		display: flex;
		justify-content: center;
		width: 540px;
	}

	/*  Lignes de vie pointillées sous chaque acteur  */
	.steps {
		--lifeline: repeating-linear-gradient(180deg, rgb(12 8 25 / 0.3) 0 14px, transparent 14px 28px);

		display: flex;
		flex-direction: column;
		gap: 22px;
		padding: 34px 0 10px;
		background:
			var(--lifeline) 268px 0 / 4px 100% no-repeat,
			var(--lifeline) 808px 0 / 4px 100% no-repeat,
			var(--lifeline) 1348px 0 / 4px 100% no-repeat;
	}
</style>
