/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing. The function also has a property 'clear'
 * that is a function which will clear the timer to prevent previously scheduled executions.
 *
 * @source underscore.js
 * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
 * @param {Function} func to wrap
 * @param {Number} wait in ms (`100`)
 * @param {Boolean} immediate to execute at the beginning (`false`)
 * @api public
 */
export const debounce = <T extends Function>(func: T, wait: number, immediate: boolean = null): T & { clear: () => void, flush: () => void } => {
	var timeout: any, args: any, context: any, timestamp: any, result: any;
	if (null == wait) wait = 100;

	function later() {
		var last = Date.now() - timestamp;

		if (last < wait && last >= 0) {
			timeout = setTimeout(later, wait - last);
		} else {
			timeout = null;
			if (!immediate) {
				result = func.apply(context, args);
				context = args = null;
			}
		}
	}

	var debounced: any = function (..._: any[]) {
		context = this;
		args = arguments;
		timestamp = Date.now();
		var callNow = immediate && !timeout;
		if (!timeout) timeout = setTimeout(later, wait);
		if (callNow) {
			result = func.apply(context, args);
			context = args = null;
		}

		return result;
	};

	debounced.clear = function () {
		if (timeout) {
			clearTimeout(timeout);
			timeout = null;
		}
	};

	debounced.flush = function () {
		if (timeout) {
			result = func.apply(context, args);
			context = args = null;

			clearTimeout(timeout);
			timeout = null;
		}
	};
	return debounced;
};
