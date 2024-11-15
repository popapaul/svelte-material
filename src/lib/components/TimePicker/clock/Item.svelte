<script lang="ts">
	
	interface Props {
		/* Copyright (c) 2020-2022 Jacques Desodt */
		ampm?: string;
		degrees?: number;
		label?: string;
		selectedAmpm?: string;
		selectedDegrees?: number;
	}

	let {
		ampm = 'am',
		degrees = 0,
		label = '',
		selectedAmpm = 'am',
		selectedDegrees = 0
	}: Props = $props();

	/* Local variables */
	let translation = $derived(ampm === 'am' || !ampm ? '6.7' : '4.5');
	
	let selectClass = $derived(degrees === selectedDegrees && (ampm === selectedAmpm || !ampm) ? '_tp-selected' : '');
	
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
