
<script lang="ts">
	import { preventDefault, createBubbler, handlers } from 'svelte/legacy';

	const bubble = createBubbler();
	import { createPopperActions, type NanoPopPosition } from '../../actions/Popper';
	import { setContext, createEventDispatcher, onMount, tick } from 'svelte';
	import './Menu.scss';
	import { clickOutside } from '../../actions/ClickOutside';
	import { fade } from 'svelte/transition';

	/** Classes to add to menu. */
	
	/** Aligns the component with respect to its bottom. */

	interface Props {
		class?: string;
		/** The menu's active state. */
		active?: boolean;
		/** Designates whether menu should open and close on activatorElem hover. */
		hover?: boolean;
		/** Designates if menu should close when its content is clicked. */
		closeOnClick?: boolean;
		/** Removes the border radius. */
		tile?: boolean;
		/** Disables the menu. */
		disabled?: boolean;
		/** The desired position of the menu */
		placement?: NanoPopPosition;
		/** Styles for the menu. */
		style?: string;
		rightClick?: boolean;
		fullWidth?: boolean;
		nudgeX?: number;
		nudgeY?: number;
		children?: import('svelte').Snippet;
		activator?: import('svelte').Snippet;
	}

	let {
		class: klass = '',
		active = $bindable(),
		hover = false,
		closeOnClick = true,
		tile = false,
		disabled = false,
		placement = 'bottom-middle',
		style = '',
		rightClick = false,
		fullWidth = false,
		nudgeX = 0,
		nudgeY = 0,
		children,
		activator
	}: Props = $props();

	let activatorWidth = $state(0);
	let activatorElem: HTMLButtonElement = $state();
	let menu: HTMLDialogElement = $state();
	let clicked = $state(false);
	const dispatch = createEventDispatcher();

	setContext('S_ListItemRole', 'menuitem');
	setContext('S_ListItemRipple', true);

	const [popperRef, popperContent] = createPopperActions();

	onMount(() => {
		const target = activatorElem.firstElementChild as HTMLElement;

		const { destroy } = popperRef(target);
		return destroy;
	});

	const close = () => {
		active = false;
		clicked = false;
		dispatch('close');
	};

	const open = async () => {
		if (disabled) return;
		activatorWidth = activatorElem.firstElementChild.clientWidth;

		active = true;

		await tick();

		menu?.showModal();

		dispatch('open');
	};

	const menuClick = () => {
		closeOnClick && close();
	};
	const activatorClick = () => {
		clicked = true;
		open();
	};
	//$: menu && active ? open() : close();
</script>

<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	use:clickOutside
	onclickOutside={close}
	onmouseleave={() => !clicked && hover && close()}
	style="display:contents"
>
	<div
		bind:this={activatorElem}
		onmouseenter={() => hover && open()}
		onclick={() => !rightClick && activatorClick()}
		onkeydown={() => !rightClick && activatorClick()}
		oncontextmenu={preventDefault(() => rightClick && activatorClick())}
		popovertargetaction="show"
		style="display:contents;"
	>
		{@render activator?.()}
	</div>

	{#if active}
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<dialog
			transition:fade={{ duration: 300 }}
			bind:this={menu}
			onclose={handlers(close, bubble('close'))}
			onclick={handlers((event) => event.target == menu && close(), menuClick)}
			use:popperContent={{ position: placement }}
			popover="manual"
			{style}
			class="s-menu {klass}"
			style:width={fullWidth ? activatorWidth + 'px' : null}
			style:margin-right="{nudgeX}px"
			style:margin-top="{nudgeY}px"
			style:margin-left="{0}px"
			style:margin-bottom="{0}px"
			class:tile
			onkeydown={menuClick}
		>
			{@render children?.()}
		</dialog>
	{/if}
</div>
