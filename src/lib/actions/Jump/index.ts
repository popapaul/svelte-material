import jumpAnimate from './jump';

interface JumpOptions {
	target?: HTMLElement;
	duration?: number;
	offset?: number;
	callback?(): void;
	easing?(): number;
}

export const jump = (node: HTMLElement & { href?: string }, _options: JumpOptions = {}) => {
	let options = _options;
	let target = options.target || node.getAttribute('data-target') || node.href;
	const Jump = () => {
		jumpAnimate(target, options);
	};

	node.addEventListener('pointerdown', Jump);

	return {
		update(newOptions) {
			options = newOptions;
			target = options.target || node.getAttribute('data-target') || node.href;
			if (!options) node.removeEventListener('pointerdown', Jump);
		},
		destroy() {
			node.removeEventListener('pointerdown', Jump);
		}
	};
};
