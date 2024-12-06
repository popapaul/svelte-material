
<script lang="ts">
	import { preventDefault, createBubbler, handlers } from 'svelte/legacy';
	import { debounce } from "../../internal/Debounce";
	const bubble = createBubbler();
	import { createPopperActions, type NanoPopPosition } from '../../actions/Popper';
	import { setContext, createEventDispatcher, onMount, tick } from 'svelte';
	import './Menu.scss';
	import { clickOutside } from '../../actions/ClickOutside';
	import { portal } from '../../actions/Portal';
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

		openOnClick?: boolean;
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
		openOnClick = true,
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
	let hovered = $state(false);
	let timeout;
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
		dispatch('close');
	};

	const open = async () => {
		if (disabled) return;
		activatorWidth = activatorElem.firstElementChild.clientWidth;
		await tick();
		menu?.show();
		dispatch('open');
	};

	const menuClick = () => {
		closeOnClick && close();
	};

	$effect(()=>{
		if(!menu) return;
		if(active || hovered)  
			open();
		else
		 	close();
	})
	
	const handleMouseLeave = (event) => {
		if(!hover) return;
		// Check if the mouse left both the dialog and activator
		if ([menu, activatorElem].some(el => el?.contains(event.relatedTarget))) return;

		timeout = setTimeout(()=>hovered= false, 100);
	}
	const handleMouseEnter = (event) => {
		if(!hover) return;
		clearTimeout(timeout);
		hovered = true;
	}
	
</script>

	<!-- svelte-ignore a11y-mouse-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		bind:this={activatorElem}
		onpointerenter={handleMouseEnter}
		onpointerleave={handleMouseLeave}
		onclick={() => openOnClick && (active = !active)}
		onkeydown={() => openOnClick && (active = !active)}
		oncontextmenu={preventDefault(() => rightclick && (active = true)  && (hovered=false))}
		popovertargetaction="show"
		style="display:contents;"
	>
		{@render activator?.()}
	</div>

	{#if active || hovered}
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<dialog
			use:portal
			use:clickOutside
			onclickOutside={()=>(active = false) && (hovered = false)}
			transition:fade|global={{ duration: 300 }}
			bind:this={menu}

			onpointerenter={handleMouseEnter}
			onpointerleave={handleMouseLeave}

			onclose={(event)=> {event.stopPropagation(); close()}}
			onclick={menuClick}
			onkeydown={menuClick}
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
		>
			{@render children?.()}
		</dialog>
	{/if}
