<script lang="ts">
	import { run, preventDefault, stopPropagation, passive } from 'svelte/legacy';

	import Hand, { type TimeMode } from './Hand.svelte';
	import HoursPane from './HoursPane.svelte';
	import MinutesPane from './MinutesPane.svelte';
	import { createEventDispatcher } from 'svelte';
	import {
		getDateFromHoursPosition,
		getDateFromMinutesPosition,
		getPosition
	} from '../scripts/positions.js';
	import { isAm } from '../scripts/dates';
	const dispatch = createEventDispatcher();
	/* The class used to animate the hand when the pane change */
	const TRANSITION_CLASS = '_tp-hasTransition';

	interface Props {
		clockClassName?: string;
		is24h?: boolean;
		minutesIncrement?: number;
		zIndex?: number;
		value?: any;
		mode?: TimeMode;
	}

	let {
		clockClassName = '',
		is24h = false,
		minutesIncrement = 1,
		zIndex = 0,
		value = $bindable(),
		mode = 'hour'
	}: Props = $props();

	/* Local variables */
	let amSelected = $state();
	run(() => {
		amSelected = isAm(value);
	});
	let currentPosition = { x: 0, y: 0 };
	let currentWidth = 0;
	let mouseDown = false;
	let transitionClass = $state(TRANSITION_CLASS);
	/* Handles the mouse down and touchstart event */
	const handleMouseDown = (event) => {
		event.target.style.cursor = 'move';
		mouseDown = true;
		/* No transition on the hand as the mouse move */
		transitionClass = '';
		/* Gets the canvas width (width = height) */
		currentWidth = event.target.offsetWidth;
		/* Computes the current position */
		currentPosition = getPosition(event);
		/* Updates the value when the mouse has moved */
		updateDate();
		return false;
	};
	/* Handles the mouse enter and touch enter event */
	const handleMouseEnter = (event) => {
		event.target.style.cursor = 'default';
	};
	/* Handles the mouse leave and touchcancel event */
	const handleMouseLeave = () => {
		/* Resets the values */
		mouseDown = false;
	};
	/* Handles the mouse move event and touchmove in the canvas.
 (0, 0) = center */
	const handleMouseMove = (event) => {
		if (mouseDown) {
			/* Computes the current position */
			currentPosition = getPosition(event);
			/* Updates the value when the mouse has moved */
			updateDate();
		}
	};
	/* Handles the mouse up and touchend event */
	const handleMouseUp = (event) => {
		event.target.style.cursor = 'default';
		mouseDown = false;
		transitionClass = TRANSITION_CLASS;
		/* Computes the current position */
		currentPosition = getPosition(event);
		/* Updates the value when the mouse events are ending */
		updateDate();
		dispatch('change', value);
		/* Propagates the change hour event */

		if (mode == 'hour') dispatch('hour', value);
		else dispatch('minute', value);
	};
	/* Updates the value when a mouse event fires */
	const updateDate = () => {
		/* Checks the wrapper mode */
		if (mode == 'hour') {
			/* Computes the value with the new hour */
			value = new Date(getDateFromHoursPosition(value, currentPosition, currentWidth, is24h, amSelected));
		} else {
			/* Computes the value with the new minute */
			value = new Date(getDateFromMinutesPosition(value, currentPosition, minutesIncrement));
		}
	};
</script>

<div class="_tp-container {clockClassName}">
	<div class="_tp-clock">
		<!-- The hidden canvas used to manage the mouse events and positions -->
		<canvas
			style="z-index:{zIndex + 10};"
			onmousedown={stopPropagation(preventDefault(handleMouseDown))}
			use:passive={['touchstart', () => stopPropagation(handleMouseDown)]}
			onmouseenter={stopPropagation(preventDefault(handleMouseEnter))}
			onmouseleave={stopPropagation(preventDefault(handleMouseLeave))}
			ontouchcancel={stopPropagation(preventDefault(handleMouseLeave))}
			onmousemove={stopPropagation(preventDefault(handleMouseMove))}
			use:passive={['touchmove', () => stopPropagation(handleMouseMove)]}
			onmouseup={stopPropagation(preventDefault(handleMouseUp))}
			ontouchend={stopPropagation(preventDefault(handleMouseUp))}
		>
		</canvas>
		<!-- The clock hand -->

		<div class="_tp-center"></div>
		<Hand {is24h} {mode} {transitionClass} {value} />
		{#if mode == 'hour'}
			<HoursPane {is24h} {value} />
		{:else}
			<MinutesPane {value} />
		{/if}
	</div>
</div>

<style>
	canvas {
		height: 100%;
		left: 0;
		position: absolute;
		top: 0;
		width: 100%;
	}

	._tp-center {
		color: var(--alternate, #fff);
		background: #1976d2;
		background: var(--primary, #1976d2);

		border-radius: 50%;
		height: 6px;
		left: 50%;
		position: absolute;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 6px;
	}

	._tp-container {
		align-items: center;
		background-color: #fff;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding-bottom: 1.5rem;
		padding-top: 1.5rem;
		width: 100%;
	}
	._tp-clock {
		background-color: #eee;
		border-radius: 50%;
		height: 16rem;
		position: relative;
		width: 16rem;
	}
</style>
