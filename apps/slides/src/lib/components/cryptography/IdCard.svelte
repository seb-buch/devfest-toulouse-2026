<script lang="ts">
	type Props = {
		name: string;
		/** Photo d'identité (ratio 7:9) ; sans photo, silhouette placeholder */
		photo?: string;
	};

	const { name, photo }: Props = $props();
</script>

<!--  Carte d'identité : photo d'identité, nom  -->
<div class="id-card">
	<div class="body">
		{#if photo}
			<img class="photo" src={photo} alt="Photo d'identité de {name}" />
		{:else}
			<svg class="photo" viewBox="0 0 70 90" aria-hidden="true">
				<circle cx="35" cy="34" r="16" />
				<path d="M 6 90 C 6 66, 20 56, 35 56 C 50 56, 64 66, 64 90 Z" />
			</svg>
		{/if}
		<div class="identity">
			<span class="label">Nom</span>
			<span class="name">{name}</span>
		</div>
	</div>
</div>

<style>
	/*  Même grammaire que les cartouches : contour épais, ombre portée dure  */
	.id-card {
		width: 320px;
		box-sizing: border-box;
		border: 5px solid var(--night-silhouette);
		border-radius: 14px;
		box-shadow: 10px 12px 0 var(--night-silhouette);
		overflow: hidden;
		background:
			radial-gradient(circle, rgb(255 255 255 / 0.4) 2px, transparent 2.5px) 0 0 / 16px 16px,
			linear-gradient(160deg, #fff1d6 0%, #ffd9c2 60%, #ffc2d9 100%);
	}

	.body {
		display: flex;
		align-items: center;
		gap: 18px;
		padding: 14px 16px;
	}

	.photo {
		width: 98px;
		height: 126px;
		flex-shrink: 0;
		object-fit: cover;
		border: 4px solid var(--night-silhouette);
		border-radius: 4px;
		background: #8fa3c0;
		box-sizing: border-box;
	}

	svg.photo {
		fill: #3a4660;
	}

	.identity {
		display: flex;
		flex-direction: column;
		line-height: 1.1;
	}

	.label {
		font-size: 18px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 2px;
		opacity: 0.7;
	}

	.name {
		font-family: 'Pricedown', sans-serif;
		font-size: 50px;
		color: var(--slyd-main-color);
	}
</style>
