import type { Attachment } from 'svelte/attachments';

/**
 * Attachment : signale si la diapo qui contient l'élément est la diapo courante.
 * Slyd monte toutes les diapos au démarrage et pose la classe « current » sur la diapo affichée.
 */
export function slideVisibility(onChange: (isCurrent: boolean) => void): Attachment {
	return (element) => {
		const slide = element.closest('.slyd-slide');
		if (!slide) return;

		const update = () => onChange(slide.classList.contains('current'));
		update();
		const observer = new MutationObserver(update);
		observer.observe(slide, { attributes: true, attributeFilter: ['class'] });
		return () => observer.disconnect();
	};
}
