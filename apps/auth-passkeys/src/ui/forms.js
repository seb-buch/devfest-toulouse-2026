import { api, AuthForm } from './form.js';
import {
	addPasskey,
	defaultPasskeyName,
	recoverAccount,
	signalAccount,
	signIn,
	signUp
} from './passkey.js';

customElements.define(
	'auth-login',
	class extends AuthForm {
		connectedCallback() {
			super.connectedCallback();
			void this.startConditionalUI();
		}

		disconnectedCallback() {
			this.conditional?.abort();
		}

		async startConditionalUI() {
			if (!(await PublicKeyCredential.isConditionalMediationAvailable?.())) return;
			this.conditional?.abort();
			const controller = new AbortController();
			this.conditional = controller;
			try {
				if (await signIn({ mediation: 'conditional', signal: controller.signal })) {
					await this.app.refresh();
				}
			} catch (error) {
				if (controller.signal.aborted || !this.isConnected) return;
				if (error.name !== 'NotAllowedError') {
					this.querySelector('[role="alert"]').textContent = error.message;
				}
				void this.startConditionalUI();
			}
		}

		async submit({ username }) {
			// Only one WebAuthn request at a time: the autofill one is cancelled.
			this.conditional?.abort();
			try {
				await signIn({ username: username.trim() });
				await this.app.refresh();
			} catch (error) {
				void this.startConditionalUI();
				throw error;
			}
		}
	}
);

customElements.define(
	'auth-register',
	class extends AuthForm {
		connectedCallback() {
			super.connectedCallback();
			this.querySelector('[name="passkeyName"]').value = defaultPasskeyName();
		}

		async submit(user) {
			await signUp(user);
			await this.app.refresh();
		}
	}
);

customElements.define(
	'auth-account',
	class extends AuthForm {
		connectedCallback() {
			super.connectedCallback();
			const { displayName, username, email } = this.user;
			this.querySelector('[data-user]').textContent = `${displayName} (${username}) — ${email}`;
			this.querySelector('[name="passkeyName"]').value = defaultPasskeyName();
			this.querySelector('[data-logout]').onclick = () =>
				this.run(async () => {
					await api('logout');
					await this.app.refresh();
				});
			this.run(async () => this.showPasskeys(await api('me/passkeys', { method: 'GET' })));
		}

		async submit({ passkeyName }) {
			await addPasskey(passkeyName);
			this.showPasskeys(await api('me/passkeys', { method: 'GET' }));
		}

		async delete(passkey) {
			const remaining = await api(`me/passkeys/${passkey.credentialId}`, { method: 'DELETE' });
			this.showPasskeys(remaining);
		}

		showPasskeys(passkeys) {
			this.passkeys = passkeys;
			const template = document.getElementById('auth-passkey');
			this.querySelector('[data-passkeys]').replaceChildren(
				...passkeys.map((passkey) => {
					const item = template.content.cloneNode(true);
					item.querySelector('[data-name]').textContent = passkey.name;
					item.querySelector('[data-details]').textContent = describe(passkey);
					item.querySelector('[data-delete]').onclick = () => this.run(() => this.delete(passkey));
					return item;
				})
			);
			void signalAccount(this.user, passkeys);
		}

		// The last passkey cannot be deleted.
		afterRun() {
			if (this.passkeys?.length === 1) this.querySelector('[data-delete]').disabled = true;
		}
	}
);

customElements.define(
	'auth-recovery-request',
	class extends AuthForm {
		async submit({ email }) {
			await api('recovery/request', { body: { email } });
			this.querySelector('[data-sent]').hidden = false;
		}
	}
);

customElements.define(
	'auth-recovery',
	class extends AuthForm {
		connectedCallback() {
			super.connectedCallback();
			this.querySelector('[name="passkeyName"]').value = defaultPasskeyName();
		}

		async submit({ passkeyName }) {
			await recoverAccount(this.token, passkeyName);
			await this.app.refresh();
		}
	}
);

const formatDate = (timestamp) =>
	new Date(timestamp).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });

function describe({ deviceType, backedUp, createdAt, lastUsedAt }) {
	return [
		deviceType === 'multiDevice' ? 'Synchronisable' : 'Liée à l’appareil',
		backedUp ? 'sauvegardée' : 'non sauvegardée',
		`créée le ${formatDate(createdAt)}`,
		lastUsedAt ? `utilisée le ${formatDate(lastUsedAt)}` : 'jamais utilisée'
	].join(' · ');
}
