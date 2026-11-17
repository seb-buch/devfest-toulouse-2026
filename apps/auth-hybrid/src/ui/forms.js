import { api, AuthForm, request } from './form.js';
import { addPasskey, selectPasskey } from './passkey.js';

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
			this.conditional?.abort();
			const controller = new AbortController();
			this.conditional = controller;
			try {
				if (
					!(await PublicKeyCredential.isConditionalMediationAvailable()) ||
					controller.signal.aborted
				)
					return;
				const response = await selectPasskey(controller.signal);
				if (!response || controller.signal.aborted) return;
				await this.run(async () => {
					await api('passkey/verify-authentication', { response });
					await this.app.refresh();
				});
				if (this.isConnected) void this.startConditionalUI();
			} catch (error) {
				if (!controller.signal.aborted && error.name !== 'NotAllowedError' && this.isConnected) {
					this.querySelector('[role="alert"]').textContent = error.message;
				}
			}
		}

		async submit({ identifier, password }) {
			this.conditional?.abort();
			try {
				const field = identifier.includes('@') ? 'email' : 'username';
				const result = await api(`sign-in/${field}`, { [field]: identifier.trim(), password });
				if (result.twoFactorRedirect) this.app.show('auth-challenge');
				else await this.app.refresh();
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
		async submit(data) {
			await api('sign-up/email', data);
			await this.app.refresh();
		}
	}
);

customElements.define(
	'auth-account',
	class extends AuthForm {
		connectedCallback() {
			super.connectedCallback();
			this.querySelector('[data-user]').textContent = `${this.user.name} — ${this.user.email}`;
			this.querySelector('[data-factor]').textContent = this.user.twoFactorEnabled
				? 'activée'
				: 'désactivée';
			const toggle = this.querySelector('[data-toggle]');
			toggle.textContent = this.user.twoFactorEnabled
				? 'Désactiver le second facteur'
				: 'Activer le second facteur';
			toggle.onclick = () =>
				this.app.show(this.user.twoFactorEnabled ? 'auth-disable' : 'auth-setup');
			this.querySelector('[data-add-passkey]').onclick = () =>
				this.run(async () => {
					const status = this.querySelector('[data-passkey-status]');
					status.hidden = true;
					await addPasskey();
					status.textContent = 'Passkey ajoutée.';
					status.hidden = false;
				});
			this.querySelector('[data-logout]').onclick = () =>
				this.run(async () => {
					await api('sign-out', {});
					await this.app.refresh();
				});
		}
	}
);

customElements.define(
	'auth-setup',
	class extends AuthForm {
		async submit(data, form) {
			switch (form.dataset.step) {
				case 'password': {
					const { totpURI } = await api('two-factor/enable', data);
					const { image } = await request('qr', { uri: totpURI });
					this.querySelector('[data-qr]').src = image;
					this.querySelector('[data-secret]').textContent = new URL(totpURI).searchParams.get(
						'secret'
					);
					form.reset();
					this.querySelector('[data-step="verify"]').hidden = false;
					break;
				}
				case 'verify':
					await api('two-factor/verify-totp', data);
					await this.app.refresh();
					return;
			}
			form.hidden = true;
			this.querySelector('form:not([hidden]) input')?.focus();
		}
	}
);

customElements.define(
	'auth-challenge',
	class extends AuthForm {
		async submit({ code }) {
			await api('two-factor/verify-totp', {
				code: code.trim()
			});
			await this.app.refresh();
		}
	}
);

customElements.define(
	'auth-disable',
	class extends AuthForm {
		async submit(data) {
			await api('two-factor/disable', data);
			await this.app.refresh();
		}
	}
);
