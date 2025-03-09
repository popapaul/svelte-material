<script lang="ts">
	import './ExpansionPanel.scss';
	import { getContext } from 'svelte';
	import { EXPANSION_PANELS, type EXPANSION_PANELS_Context } from './ExpansionPanels.svelte';
	import { slide } from 'svelte/transition';
	import Icon from '../Icon/Icon.svelte';
	import down from '../../internal/Icons/down';

	const context = getContext<EXPANSION_PANELS_Context>(EXPANSION_PANELS);

	interface Props {
		// Classes to add to the panel.
		class?: string;
		contentClass?: string;
		// Options for the slide transition.
		slideOpts?: any;
		// Make the panel readonly.
		readonly?: boolean;
		// Disable the panel.
		disabled?: boolean;
		// Styles to add to the panel.
		style?: string;
		title?: string;
		value?: any;
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
		value = context.index(),
		header,
		icon,
		children
	}: Props = $props();

	
	const active = $derived(context.values.includes(value));

	function toggle() {
		context.selectPanel(value);
	}

	// Inheriting the disabled value from parent.
	$effect(() => {
		disabled = context.disabled == null ? disabled : context.disabled;
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
		>
			{@render children?.()}
		</div>
	{/if}
</div>
