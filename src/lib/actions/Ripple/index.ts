import type { RippleOptions } from './material-ripple';
export { type RippleOptions } from './material-ripple';

export const ripple = (node: Element, _options: RippleOptions | boolean = {}) => {
	let options = _options as RippleOptions;
	let destroyed = false;
	let ripple: HTMLDivElement;
	let keyboardActive = false;
	const handleStart = (e) =>
		import('./material-ripple').then((x) => (ripple = x.RippleStart(e, options)));
	const handleStop = () => import('./material-ripple').then((x) => x.RippleStop(ripple));
	const handleKeyboardStart = async (e) => {
		if (!keyboardActive && (e.keyCode === 13 || e.keyCode === 32)) {
			ripple = await import('./material-ripple').then((x) =>
				x.RippleStart(e, { ...options, centered: true })
			);
			keyboardActive = true;
		}
	};
	const handleKeyboardStop = () => {
		keyboardActive = false;
		handleStop();
	};

	function setup() {
		node.classList.add('s-ripple-container');
		node.addEventListener('pointerdown', handleStart);
		node.addEventListener('pointerup', handleStop);
		node.addEventListener('pointerleave', handleStop);
		node.addEventListener('keydown', handleKeyboardStart);
		node.addEventListener('keyup', handleKeyboardStop);
		destroyed = false;
	}

	function destroy() {
		node.classList.remove('s-ripple-container');
		node.removeEventListener('pointerdown', handleStart);
		node.removeEventListener('pointerup', handleStop);
		node.removeEventListener('pointerleave', handleStop);
		node.removeEventListener('keydown', handleKeyboardStart);
		node.removeEventListener('keyup', handleKeyboardStop);
		destroyed = true;
	}

	if (options) setup();

	return {
		update(newOptions) {
			options = newOptions;
			if (options && destroyed) setup();
			else if (!(options || destroyed)) destroy();
		},
		destroy
	};
};
