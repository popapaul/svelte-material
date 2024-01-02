interface ClickOutsideOptions {
	include?: string | string[] | HTMLElement | HTMLElement[];
}

const eventName = 'clickOutside';

export const clickOutside = (node: HTMLElement, options: ClickOutsideOptions = {}) => {
	let include = Array.isArray(options.include) ? options.include : [options.include];

	function update(newOptions) {
		include = Array.isArray(newOptions.include) ? newOptions.include : [newOptions.include];
	}

	function detect(event: MouseEvent | TouchEvent) {
		const target = event.target as HTMLElement;
		if (!node.contains(target) && !include.some((i) => childOf(i, target))) {
			node.dispatchEvent(new CustomEvent(eventName));
		}
	}
	document.addEventListener('mousedown', detect, { passive: true, capture: true });
	document.addEventListener('touchend', detect, { passive: true, capture: true });
	return {
		update,
		destroy() {
			document.removeEventListener('mousedown', detect);
			document.removeEventListener('touchend', detect);
		}
	};
};

function childOf(parent: HTMLElement | string, child: HTMLElement) {
	var node = child?.parentNode;
	var parentNode = typeof parent === 'string' ? document.querySelector(parent) : parent;
	while (node != null) {
		if (node == parentNode) {
			return true;
		}
		node = node.parentNode;
	}
	return false;
}
