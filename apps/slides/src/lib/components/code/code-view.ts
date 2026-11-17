/*
 * Vue « code » de données live : les lignes sont générées, donc leurs numéros changent d'une démo
 * à l'autre. Chaque ligne porte une clé ; les étapes de surlignage de <Code> se décrivent par clés.
 */

export type CodeLine = { text: string; key?: string };

export type CodeView = {
	code: string;
	/** Étapes de surlignage au format Slyd (« |2,3|5 »), la première montre tout */
	highlightSteps(...steps: string[][]): string;
};

export function line(text: string, key?: string): CodeLine {
	return { text, key };
}

export function codeView(lines: CodeLine[]): CodeView {
	const lineNumbers = (keys: string[]) =>
		lines.flatMap((codeLine, index) =>
			codeLine.key !== undefined && keys.includes(codeLine.key) ? [index + 1] : []
		);

	return {
		code: lines.map((codeLine) => codeLine.text).join('\n'),
		highlightSteps: (...steps) => steps.map((keys) => `|${lineNumbers(keys).join(',')}`).join('')
	};
}

/*  Valeurs affichées : chaînes entre apostrophes, identifiants base64url tronqués  */

export function quoted(value: string | undefined, maxLength = 14): string {
	if (value === undefined) return 'undefined';
	const shown = value.length > maxLength ? `${value.slice(0, maxLength)}…` : value;
	return `'${shown}'`;
}

export function list(values: (string | number)[] | undefined): string {
	if (values === undefined) return 'undefined';
	return `[${values.map((value) => (typeof value === 'string' ? quoted(value) : value)).join(', ')}]`;
}

/*
 * Objet réel affiché tel quel, champ par champ. Chaque ligne a pour clé le chemin du champ
 * (« response.clientDataJSON ») ; un objet court tient sur une ligne, un objet long est déplié.
 */
export function objectLines(value: object, maxLength = 24): CodeLine[] {
	return [line('{'), ...entryLines(value, '  ', '', maxLength), line('}')];
}

const INLINE_OBJECT_MAX_LENGTH = 40;

function entryLines(object: object, indent: string, path: string, maxLength: number): CodeLine[] {
	const entries = Object.entries(object);
	return entries.flatMap(([name, value], index) => {
		const key = `${path}${name}`;
		const comma = index < entries.length - 1 ? ',' : '';
		const inline = literal(value, maxLength);
		if (!isPlainObject(value) || inline.length <= INLINE_OBJECT_MAX_LENGTH) {
			return [line(`${indent}${name}: ${inline}${comma}`, key)];
		}
		return [
			line(`${indent}${name}: {`, key),
			...entryLines(value, `${indent}  `, `${key}.`, maxLength),
			line(`${indent}}${comma}`, key)
		];
	});
}

function literal(value: unknown, maxLength: number): string {
	if (typeof value === 'string') return quoted(value, maxLength);
	if (Array.isArray(value)) return `[${value.map((item) => literal(item, maxLength)).join(', ')}]`;
	if (isPlainObject(value)) {
		const entries = Object.entries(value);
		if (entries.length === 0) return '{}';
		return `{ ${entries.map(([name, item]) => `${name}: ${literal(item, maxLength)}`).join(', ')} }`;
	}
	return String(value);
}

function isPlainObject(value: unknown): value is object {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/*  Retire les directives destinées au compilateur des extraits chargés en ?raw  */
export function snippet(raw: string): string {
	return raw.replace(/^\/\/ @ts-nocheck\n+/, '').trimEnd();
}
