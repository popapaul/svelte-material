<script>
	import { stopPropagation } from 'svelte/legacy';

	import { onMount, createEventDispatcher } from 'svelte';
	/** @type {{year: any}} */
	let { year } = $props();
	let viewElm = $state();
	const dispatch = createEventDispatcher();
	onMount(() => {
		if (viewElm) {
			viewElm.scrollTop = viewElm.scrollHeight / 2 - viewElm.offsetHeight / 2 + 16;
		}
	});
	function onClick({ target }) {
		if (target.nodeName === 'LI') {
			dispatch('select', { year: target.textContent });
		}
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<ul bind:this={viewElm} onclick={stopPropagation(onClick)}>
	{#each Array(100) as _, i}
		{#if year - 100 + i > 0}
			<li>{year - 100 + i}</li>
		{/if}
	{/each}
	<li class="active">{year}</li>
	{#each Array(100) as _, i}
		<li>{year + 1 + i}</li>
	{/each}
</ul>

<style>
	ul {
		height: inherit;
		overflow: auto;
		margin: 0;
		padding: 0;
		list-style: none;
		font-size: 16px;
		line-height: 1.3;
		text-align: center;
	}
	li {
		cursor: pointer;
		padding: 8px 0;
	}
	li:hover {
		background: rgba(0, 0, 0, 0.1);
		background: var(--divider, rgba(0, 0, 0, 0.1));
	}
	.active {
		color: #1976d2;
		color: var(--primary, #1976d2);
		font-size: 26px;
		/* line-height: 1; */
		padding: 4px 0 3px;
	}
</style>
