import { tick } from 'svelte';
/**
 * Usage: <div use:portal={'css selector'}> or <div use:portal={document.body}>
 */
export const portal = (el: HTMLElement, target: HTMLElement | string = '.s-app') => {
	let targetEl;
	async function update(newTarget) {
		target = newTarget;
		if (typeof target === 'string') {
			targetEl = document.querySelector(target);
			if (targetEl === null) {
				await tick();
				targetEl = document.querySelector(target);
			}
			if (targetEl === null) {
				throw new Error(`No element found matching css selector: "${target}"`);
			}
		} else if (target instanceof HTMLElement) {
			targetEl = target;
		} else {
			throw new TypeError(
				`Unknown portal target type: ${
					target === null ? 'null' : typeof target
				}. Allowed types: string (CSS selector) or HTMLElement.`
			);
		}
		targetEl.appendChild(el);
		el.hidden = false;
	}

	function destroy() {
		if (el.parentNode) {
			setTimeout(() => el?.parentNode?.removeChild?.(el), 10);
		}
	}

	update(target);
	return {
		update,
		destroy
	};
};
