<script lang="ts">
	import './Chip.scss';
	import { ripple as Ripple } from '../../actions/Ripple';
	import Icon from '../Icon/Icon.svelte';
	import closeIcon from '../../internal/Icons/close';
	import type { HTMLAttributes } from 'svelte/elements';
	
	interface Props extends HTMLAttributes<HTMLElement> {
		/** Classes to add to chip. */
		class?: string;
		/** Styles to add to chip. */
		style?: string;
		/** Determines whether the chip is visible or not. */
		active?: boolean;
		/** Determines whether the chip is selected or not. */
		selected?: boolean;
		/** Specifies the size of chip. */
		size?: 'x-small' | 'small' | 'default' | 'large' | 'x-large';
		/** specifies if the chip is outlined */
		outlined?: boolean;
		/** specifies if the avatar will fill the chip in height */
		pill?: boolean;
		/** makes chip an anchor */
		href?: string;
		/** determines if the chip is a link, making it clickable */
		link?: boolean;
		/** specifies if the chip is a label, making it less rounded */
		label?: boolean;
		/** determines if a close button will appear */
		close?: boolean | import('svelte').Snippet;
		children?: import('svelte').Snippet;
	}

	let {
		class: klass = '',
		style = '',
		active = true,
		selected = false,
		size = 'default',
		outlined = false,
		pill = false,
		href = null,
		link = !!href,
		label = false,
		close = false,
		onclose,
		children,
		...rest
	}: Props = $props();
</script>

{#if active}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<span
		class="s-chip {klass} size-{size}"
		{style}
		use:Ripple={link}
		class:outlined
		class:pill
		class:link
		class:label
		class:selected
		{...rest}
	>
		{@render children?.()}
		{#if close}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="s-chip__close" onclick={onclose}>
				{#if typeof close === 'function'}
					{@render close()}
				{:else}
					<Icon path={closeIcon} />
				{/if}
			</div>
		{/if}
	</span>
{/if}
