<script lang="ts">
	import { run, createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();
	import './ExpansionPanel.scss';
	import { getContext } from 'svelte';
	import { EXPANSION_PANELS, type EXPANSION_PANELS_Context } from './ExpansionPanels.svelte';
	import { slide } from 'svelte/transition';
	import Icon from '../Icon/Icon.svelte';
	import down from '../../internal/Icons/down';

	const { values, Disabled, selectPanel, index } =
		getContext<EXPANSION_PANELS_Context>(EXPANSION_PANELS);

	// Classes to add to the panel.
	


	// Options for the slide transition.

	// Make the panel readonly.

	// Disable the panel.

	// Styles to add to the panel.
	interface Props {
		class?: string;
		contentClass?: string;
		slideOpts?: any;
		readonly?: false;
		disabled?: false;
		style?: string;
		title?: string;
		header?: import('svelte').Snippet;
		icon?: import('svelte').Snippet<[any]>;
		children?: import('svelte').Snippet;
	}

	let {
		class: klass = '',
		contentClass = null,
		slideOpts = {},
		readonly = false,
		disabled = $bindable(false),
		style = null,
		title,
		header,
		icon,
		children
	}: Props = $props();

	const value = index();
	let active = $state(false);

	function toggle() {
		selectPanel(value);
	}

	// Inheriting the disabled value from parent.
	run(() => {
		disabled = $Disabled == null ? disabled : $Disabled;
	});

	// Checking if panel is active everytime the value has changed.
	run(() => {
		active = $values.includes(value);
	});
</script>

<div
	class="s-expansion-panel {klass}"
	aria-expanded={active}
	class:active
	class:readonly
	class:disabled
	{style}
>
	<button
		type="button"
		class="s-expansion-panel__header"
		tabindex={disabled ? -1 : null}
		onclick={toggle}
	>
		<!-- Slot for the title of panel. -->
		 {#if header}
		 	{@render header()}
		 {:else}
		 	{title}
		 {/if}
		
		<div class="s-expansion-panel__icon">
			<!-- Slot for the icon at the right of the header. -->
			{#if icon}{@render icon({ active, })}{:else}
				<Icon {disabled} path={down} rotate={active ? 180 : 0} />
			{/if}
		</div>
	</button>

	{#if active}
		<div
			class="s-expansion-panel__content {contentClass}"
			transition:slide={slideOpts}
			onintrostart={bubble('introstart')}
			onoutrostart={bubble('outrostart')}
			onintroend={bubble('introend')}
			onoutroend={bubble('outroend')}
		>
			{@render children?.()}
		</div>
	{/if}
</div>
