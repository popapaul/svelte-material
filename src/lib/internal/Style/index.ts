export function format(input:number|string) {
	if (!isNaN(Number(input))) return `${input}px`;
	return input?.toString?.();
}

export const getStyle = (_styles:Record<string,string|number>) => {
	let styles = _styles;

	return Object.entries(styles).reduce((acumulator, [key, value]) => {
		return value ? acumulator + `--s-${key}:${format(value)};` : '';
	}, '');
};

/**
 * @param node {Element}
 * @param styles {Object}
 */
export default (node:HTMLElement, _styles:Record<string,string|number>) => {
	let styles = _styles;
	Object.entries(styles).forEach(([key, value]) => {
		if (value) node.style.setProperty(`--s-${key}`, format(value));
	});

	return {
		update(newStyles:Record<string,string|number>) {
			Object.entries(newStyles).forEach(([key, value]) => {
				if (value) {
					node.style.setProperty(`--s-${key}`, format(value));
					delete styles[key];
				}
			});

			Object.keys(styles).forEach(name => node.style.removeProperty(`--s-${name}`));
			styles = newStyles;
		}
	};
};
