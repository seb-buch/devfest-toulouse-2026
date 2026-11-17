import './forms.js';
import { api } from './form.js';

customElements.define(
	'auth-app',
	class extends HTMLElement {
		connectedCallback() {
			// Recovery link: the token is in the fragment, removed from the address bar once read.
			const token = new URLSearchParams(location.hash.slice(1)).get('token');
			if (token) {
				history.replaceState(null, '', location.pathname);
				this.show('auth-recovery', { token });
				return;
			}
			this.refresh().catch((error) => {
				this.show('auth-login');
				this.querySelector('[role="alert"]').textContent = error.message;
			});
		}

		show(name, properties = {}) {
			const screen = Object.assign(document.createElement(name), properties);
			this.replaceChildren(screen);
			screen.querySelector('h1').focus();
		}

		async refresh() {
			try {
				this.show('auth-account', { user: await api('me', { method: 'GET' }) });
			} catch (error) {
				if (error.status !== 401) throw error;
				this.show('auth-login');
			}
		}
	}
);
