<!--  Légende des flags de authenticatorData, sous le code  -->
<dl class="flags">
	<dt>UP</dt>
	<dd>utilisateur présent</dd>
	<dt>UV</dt>
	<dd>utilisateur vérifié</dd>
	<dt>BE</dt>
	<dd>sauvegardable</dd>
	<dt>BS</dt>
	<dd>sauvegardée</dd>
	<dt>AT</dt>
	<dd>clé publique jointe</dd>
</dl>

<style>
	.flags {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 4px 12px;
		margin: 0;
		font-size: 22px;

		dt {
			padding: 0 8px;
			background: var(--sunset-yellow);
			font-family: var(--slyd-code-font), monospace;
			font-weight: 600;
		}

		dd {
			margin: 0 12px 0 0;
		}
	}
</style>
