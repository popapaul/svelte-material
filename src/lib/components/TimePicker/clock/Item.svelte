<script lang="ts">
	/* Copyright (c) 2020-2022 Jacques Desodt */
	export let ampm = 'am';
	export let degrees = 0;
	export let label = '';
	export let selectedAmpm = 'am';
	export let selectedDegrees = 0;

	/* Local variables */
	let translation;
	$: translation = ampm === 'am' || !ampm ? '6.7' : '4.5';
	let selectClass;
	$: selectClass =
		degrees === selectedDegrees && (ampm === selectedAmpm || !ampm) ? '_tp-selected' : '';
</script>

<div
	class="_tp-item-container"
	style="transform: rotate({degrees}deg) translate({translation}rem) rotate(-{degrees}deg);"
>
	<div class="_tp-item _tp-item-{ampm} {selectClass}">
		{label}
	</div>
</div>

<style>
	._tp-item {
		color: black;
		font-size: 1rem;
		font-weight: 400;
		line-height: 1.5;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	._tp-item._tp-selected {
		color: #fff;
	}
	._tp-item-am {
		margin-top: -0.7rem;
	}
	._tp-item-pm {
		font-size: 0.85rem;
		line-height: 1.4;
		margin-top: -0.58rem;
	}
	._tp-item-container {
		left: 50%;
		margin-left: -1rem;
		position: absolute;
		text-align: center;
		top: 50%;
		width: 2rem;
	}
</style>
