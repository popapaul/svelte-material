/* eslint-disable */
// Robert Penner's easeInOutQuad

// find the rest of his easing functions here: http://robertpenner.com/easing/
// find them exported for ES6 consumption here: https://github.com/jaxgeller/ez.js

var easeInOutQuad = function easeInOutQuad(t:number, b:number, c:number, d:number) {
	t /= d / 2;
	if (t < 1) return (c / 2) * t * t + b;
	t--;
	return (-c / 2) * (t * (t - 2) - 1) + b;
};

var _typeof =
	typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
		? function (obj:any) {
				return typeof obj;
		  }
		: function (obj:any) {
				return obj &&
					typeof Symbol === 'function' &&
					obj.constructor === Symbol &&
					obj !== Symbol.prototype
					? 'symbol'
					: typeof obj;
		  };

var jumper = function jumper() {
	// private variable cache
	// no variables are created during a jump, preventing memory leaks

	var element:HTMLElement | null; // element to scroll to                   (node)

	var start:number; // where scroll starts                    (px)
	var stop:number; // where scroll stops                     (px)

	var offset:number; // adjustment from the stop position      (px)
	var easing:(t: number, b: number, c: number, d: number) => number; // easing function                        (function)
	var a11y:boolean; // accessibility support flag             (boolean)

	var distance:number; // distance of scroll                     (px)
	var duration:number; // scroll duration                        (ms)

	var timeStart:number; // time scroll started                    (ms)
	var timeElapsed:number; // time spent scrolling thus far          (ms)

	var next:number; // next scroll position                   (px)

	var callback:()=>any; // to call when done scrolling            (function)

	// scroll position helper

	function location() {
		return window.scrollY || window.pageYOffset;
	}

	// element offset helper

	function top(element:HTMLElement) {
		return element.getBoundingClientRect().top + start;
	}

	// rAF loop helper

	function loop(timeCurrent:number) {
		// store time scroll started, if not started already
		if (!timeStart) {
			timeStart = timeCurrent;
		}

		// determine time spent scrolling so far
		timeElapsed = timeCurrent - timeStart;

		// calculate next scroll position
		next = easing(timeElapsed, start, distance, duration);

		// scroll to it
		window.scrollTo(0, next);

		// check progress
		timeElapsed < duration
			? window.requestAnimationFrame(loop) // continue scroll loop
			: done(); // scrolling is done
	}

	// scroll finished helper

	function done() {
		// account for rAF time rounding inaccuracies
		window.scrollTo(0, start + distance);

		// if scrolling to an element, and accessibility is enabled
		if (element && a11y) {
			// add tabindex indicating programmatic focus
			element.setAttribute('tabindex', '-1');

			// focus the element
			element.focus();
		}

		// if it exists, fire the callback
		if (typeof callback === 'function') {
			callback();
		}

		// reset time for next jump
		timeStart = 0;
	}

	// API

	function jump(target:any, options:any = {}) {

		// resolve options, or use defaults
		duration = options.duration || 1000;
		offset = options.offset || 0;
		callback = options.callback; // "undefined" is a suitable default, and won't be called
		easing = options.easing || easeInOutQuad;
		a11y = options.a11y || false;

		// cache starting position
		start = location();

		// resolve target
		switch (typeof target === 'undefined' ? 'undefined' : _typeof(target)) {
			// scroll from current position
			case 'number':
				element = null; // no element to scroll to
				a11y = false; // make sure accessibility is off
				stop = start + parseInt(target);
				break;

			// scroll to element (node)
			// bounding rect is relative to the viewport
			case 'object':
				element = target as unknown as HTMLElement;
				stop = top(element);
				break;

			// scroll to element (selector)
			// bounding rect is relative to the viewport
			case 'string':
				element = document.querySelector(target);
				stop = top(element!);
				break;
		}

		// resolve scroll distance, accounting for offset
		distance = stop - start + offset;

		// resolve duration
		switch (_typeof(options.duration)) {
			// number in ms
			case 'number':
				duration = options.duration;
				break;

			// function passed the distance of the scroll
			case 'function':
				duration = options.duration(distance);
				break;
		}

		// start the loop
		window.requestAnimationFrame(loop);
	}

	// expose only the jump method
	return jump;
};

// export singleton

var singleton = jumper();

export default singleton;
