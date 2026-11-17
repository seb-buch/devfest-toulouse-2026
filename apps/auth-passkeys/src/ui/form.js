export async function api(path, { method = 'POST', body } = {}) {
	const response = await fetch(`../api/${path}`, {
		method,
		headers: body ? { 'Content-Type': 'application/json' } : {},
		body: body ? JSON.stringify(body) : undefined,
		cache: 'no-store'
	});
	const data = await response.json().catch(() => null);
	if (!response.ok) {
		throw Object.assign(new Error(data?.message || `Erreur ${response.status}`), {
			status: response.status
		});
	}
	return data;
}

/** Errors raised by navigator.credentials.create() / get(). */
const WEBAUTHN_ERRORS = {
	NotAllowedError: 'Opération annulée ou expirée.',
	InvalidStateError: 'Cet authentificateur contient déjà une passkey de ce compte.'
};

export class AuthForm extends HTMLElement {
	get app() {
		return this.closest('auth-app');
	}

	connectedCallback() {
		this.append(document.getElementById(this.localName).content.cloneNode(true));
		this.addEventListener('submit', (event) => {
			event.preventDefault();
			const form = event.target;
			const data = Object.fromEntries(new FormData(form));
			this.run(() => this.submit(data, form));
		});
		this.querySelectorAll('[data-screen]').forEach((button) => {
			button.onclick = () => this.app.show(button.dataset.screen);
		});
	}

	async run(action) {
		if (this.busy) return;
		this.busy = true;
		const alert = this.querySelector('[role="alert"]');
		alert.textContent = '';
		this.querySelectorAll('fieldset, button').forEach((element) => (element.disabled = true));
		this.setAttribute('aria-busy', 'true');
		try {
			await action();
		} catch (error) {
			alert.textContent = WEBAUTHN_ERRORS[error.name] ?? error.message;
		} finally {
			this.busy = false;
			this.removeAttribute('aria-busy');
			this.querySelectorAll('fieldset, button').forEach((element) => (element.disabled = false));
			this.afterRun?.();
		}
	}
}
