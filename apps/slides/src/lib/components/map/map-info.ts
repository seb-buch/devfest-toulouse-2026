/*
 * Données des missions de Passkeys City : noms des positions du parcours, et pour chaque mission
 * son titre, son brief, son quartier et son lieu de rendez-vous. Seule source de vérité pour les
 * slides de titre, les cartes et les bilans de mission.
 * Les textes sont du HTML (rendus avec {@html}) : `&nbsp;`, `<br/>`, etc. sont permis.
 * Les coordonnées sont dans map-markers.json.
 */

export type PositionName = 'start' | 'mission-1' | 'mission-2' | 'mission-3' | 'mission-4' | 'end';

/*  Positions qui ont une mission (l'arrivée compte : elle a sa slide de titre)  */
export type MissionName = Exclude<PositionName, 'start'>;

export interface MissionInfo {
	/** Nom de mission : slide de titre et bilan « Mission accomplie » */
	title: string;
	/** Phrase sous le titre de la slide de titre */
	brief: string;
	/** Quartier sur la carte, affiché en bas à droite de la slide de titre comme dans GTA V */
	district: string;
	/** Objectif sur la carte : « Rendez-vous {preposition} {name} » */
	place: { preposition: string; name: string };
}

export const missions: Record<MissionName, MissionInfo> = {
	'mission-1': {
		title: 'Rien à déclarer',
		brief:
			'Montrer patte blanche deux fois&nbsp;:<br/>un mot de passe, puis un code à six chiffres.<br/>Tout est en règle ?',
		district: 'DevFest City International Airport',
		place: { preposition: 'au', name: 'Terminal 2FA' }
	},
	'mission-2': {
		title: 'Lecture publique',
		brief:
			'Une clé que tout le monde peut lire, une autre que personne ne voit&nbsp;:<br/>On va potasser WebAuthn.',
		district: 'Downtown',
		place: { preposition: 'à la', name: 'Bibliothèque du W3C' }
	},
	'mission-3': {
		title: 'Mise à feu',
		brief:
			'Fini la théorie&nbsp;:<br/>on branche les passkeys sur notre app, et on allume les moteurs.',
		district: 'Space City',
		place: { preposition: 'au', name: 'Pas de tir' }
	},
	'mission-4': {
		title: 'Terra incognita',
		brief:
			"Une app sans aucun mot de passe, récupération de compte comprise&nbsp;:<br/>explorer le territoire où peu d'apps sont allées.",
		district: 'University Heights',
		place: { preposition: 'au', name: 'Laboratoire' }
	},
	end: {
		title: 'Débriefing',
		brief:
			"Retour au monde réel&nbsp;:<br/>ce qu'Alice et Bob ont appris, et un plan pour s'y mettre dès lundi.",
		district: 'Tech Park',
		place: { preposition: 'au', name: 'Centre de congrès' }
	}
};

/*  Numéro de mission tiré du nom de la position (mission-1 → 1)  */
export function missionNumber(name: PositionName): number | undefined {
	const match = /^mission-(\d+)$/.exec(name);
	return match ? Number(match[1]) : undefined;
}
