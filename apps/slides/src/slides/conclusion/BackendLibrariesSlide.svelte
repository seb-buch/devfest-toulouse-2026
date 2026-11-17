<script lang="ts">
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';

	const libraries = [
		{
			language: 'Node.js / TS',
			name: 'SimpleWebAuthn',
			repo: 'https://github.com/MasterKale/SimpleWebAuthn'
		},
		{
			language: '.NET / C#',
			name: 'fido2-net-lib',
			repo: 'https://github.com/passwordless-lib/fido2-net-lib'
		},
		{
			language: 'Go',
			name: 'go-webauthn/webauthn',
			repo: 'https://github.com/go-webauthn/webauthn'
		},
		{ language: 'Python', name: 'py_webauthn', repo: 'https://github.com/duo-labs/py_webauthn' },
		{ language: 'Rust', name: 'webauthn-rs', repo: 'https://github.com/kanidm/webauthn-rs' },
		{ language: 'Java', name: 'webauthn4j', repo: 'https://github.com/webauthn4j/webauthn4j' }
	];
</script>

<Slide>
	<h3>Annexe&nbsp;: bibliothèques serveur WebAuthn</h3>

	<table>
		<tbody>
			{#each libraries as library (library.repo)}
				<tr>
					<th scope="row">{library.language}</th>
					<td>
						<a href={library.repo} target="_blank" rel="external noreferrer">{library.name}</a>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<SpeakerNotes>
		<p>
			Pour les questions : les bibliothèques serveur les plus utilisées. SimpleWebAuthn, celle des
			démos, pour Node.js. fido2-net-lib pour .NET. go-webauthn et py_webauthn pour Go et Python.
			webauthn-rs, du projet Kanidm, pour Rust. En Java, webauthn4j ou java-webauthn-server de
			Yubico.
		</p>
		<p>
			Côté frameworks : Better Auth (app hybride), Spring Security, ASP.NET Core Identity ont un
			support intégré.
		</p>
	</SpeakerNotes>
</Slide>

<style>
	table {
		margin: 80px auto 0;
		border-collapse: separate;
		border-spacing: 0 14px;
		font-size: 34px;
		text-align: left;
	}

	th,
	td {
		padding: 12px 40px;
		background: #fff;
		border-block: 5px solid var(--night-silhouette);
	}

	th {
		border-left: 5px solid var(--night-silhouette);
		font-weight: 600;
	}

	td {
		border-right: 5px solid var(--night-silhouette);
	}

	a {
		font-family: var(--slyd-code-font), monospace;
		color: var(--slyd-accent-color);
	}
</style>
