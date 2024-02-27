<script context="module" lang="ts">
	const TIME_MODE = { hour: 'hour', minute: 'minute' } as const;
	export type TimeMode = keyof typeof TIME_MODE;
</script>

<script lang="ts">
	import { getAmPm, hourToDegrees, minuteToDegrees } from '../scripts/dates';

	export let is24h: boolean;

	export let value = new Date();
	export let mode: TimeMode;
	export let transitionClass: string = null;

	$: ampm = mode == 'hour' ? (is24h ? getAmPm(value) : 'am') : 'am';

	$: degrees = mode == 'hour' ? hourToDegrees(value) : minuteToDegrees(value);
</script>

<div
	class="_tp-hand _tp-hand-{ampm} {transitionClass}"
	style="transform: rotateZ({90 + degrees}deg);"
>
	<div class="_tp-pointer"></div>
</div>

<style>
	._tp-hand {
		bottom: 50%;
		left: calc(50% - 1px);
		position: absolute;
		transform-origin: center bottom 0;
		width: 2px;
		background: #1976d2;
		color: #1976d2;
		background: var(--primary, #1976d2);
	}
	._tp-hand._tp-hasTransition {
		transition:
			transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0ms,
			height 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0ms;
	}
	._tp-hand-am {
		height: 39.5%;
	}
	._tp-hand-pm {
		height: 26.5%;
	}
	._tp-pointer {
		background: #1976d2;
		color: #1976d2;
		background: var(--primary, #1976d2);
		border: 14px solid;
		border-radius: 100%;
		box-sizing: content-box;
		height: 4px;
		left: -16px;
		position: absolute;
		top: -21px;
		width: 4px;
	}
</style>
