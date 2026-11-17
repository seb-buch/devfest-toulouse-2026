import './forms.js';
import { api } from './form.js';

customElements.define(
	'auth-demo',
	class extends HTMLElement {
		connectedCallback() {
			this.refresh().catch((error) => {
				this.show('auth-login');
				this.querySelector('[role="alert"]').textContent = error.message;
			});
		}

		show(name, properties = {}) {
			const form = Object.assign(document.createElement(name), properties);
			this.replaceChildren(form);
			form.querySelector('h1').focus();
		}

		async refresh() {
			const session = await api('get-session');
			this.show(session ? 'auth-account' : 'auth-login', { user: session?.user });
		}
	}
);
