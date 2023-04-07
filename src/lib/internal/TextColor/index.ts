/* eslint-disable no-param-reassign */

/**
 * @param {string} klass
 */
function formatClass(klass:string) {
	return klass.split(' ').map(i => {
		if (/^(lighten|darken|accent)-/.test(i)) {
			return `text-${i}`;
		}
		return `${i}-text`;
	});
}

function setTextColor(node:HTMLElement, text:string) {
	if (/^(#|rgb|hsl|currentColor)/.test(text)) {
		// This is a CSS hex.
		node.style.color = text;
		return false;
	}
	if (text.startsWith('--')) {
		// This is a CSS variable.
		node.style.color = `var(${text})`;
		return false;
	}
	const klass = formatClass(text);
	node.classList.add(...klass);
	return klass;
}

/**
 * @param node {Element}
 * @param text {string|boolean}
 */
export default (node:HTMLElement, text:string|boolean) => {
	let klass:false | string[];
	if (typeof text === 'string') {
		klass = setTextColor(node, text);
	}

	return {
		update(newText:string|boolean) {
			if (klass) {
				node.classList.remove(...klass);
			} else {
				node.style.color = "";
			}

			if (typeof newText === 'string') {
				klass = setTextColor(node, newText);
			}
		}
	};
};
