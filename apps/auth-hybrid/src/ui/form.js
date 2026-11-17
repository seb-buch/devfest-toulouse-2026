export async function request(path, body) {
	const response = await fetch(path, {
		method: body ? 'POST' : 'GET',
		headers: body ? { 'Content-Type': 'application/json' } : {},
		body: body ? JSON.stringify(body) : undefined,
		cache: 'no-store'
	});
	const data = await response.json();
	if (!response.ok) throw new Error(data.message || `Erreur ${response.status}`);
	return data;
}

export const api = (path, body) => request(`../api/${path}`, body);

export class AuthForm extends HTMLElement {
	get app() {
		return this.closest('auth-demo');
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
		this.querySelectorAll('[data-cancel]').forEach((button) => {
			button.onclick = () => this.run(() => this.app.refresh());
		});
	}

	async run(action) {
		if (this.busy) return;
		this.busy = true;
		const error = this.querySelector('[role="alert"]');
		error.textContent = '';
		this.querySelectorAll('fieldset, button').forEach((element) => (element.disabled = true));
		this.setAttribute('aria-busy', 'true');
		try {
			await action();
		} catch (cause) {
			error.textContent = cause.message;
		} finally {
			this.busy = false;
			this.removeAttribute('aria-busy');
			this.querySelectorAll('fieldset, button').forEach((element) => (element.disabled = false));
		}
	}
}
