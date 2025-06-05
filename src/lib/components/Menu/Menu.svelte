
<script lang="ts">
	import { preventDefault } from 'svelte/legacy';
	import { createPopperActions, type NanoPopPosition } from '../../actions/Popper';
	import { setContext, onMount, tick } from 'svelte';
	import './Menu.scss';
	import { clickOutside } from '../../actions/ClickOutside';
	import { portal } from '../../actions/Portal';
	import { fade } from 'svelte/transition';
	import uid from '$lib/internal/uid';

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
		onclose?: () => void;
		onopen?: () => void;
		children?: import('svelte').Snippet;
		activator?: import('svelte').Snippet;
	}

	let {
		class: klass = '',
		active = $bindable(),
		hover = false,
		onclose,
		onopen,
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
	
	const id =  `s-menu-${uid(5)}`;
	let activatorWidth = $state(0);
	let activatorElem: HTMLDivElement = $state();
	let menu: HTMLElement = $state();
	let hovered = $state(false);
	let timeout;

	setContext('S_ListItemRole', 'menuitem');
	setContext('S_ListItemRipple', true);

	const [popperRef, popperContent] = createPopperActions();

	onMount(() => {
		const target = activatorElem.firstElementChild as HTMLElement;

		const { destroy } = popperRef(target);
		return destroy;
	});

	const close = () => {
		onclose?.();
	};

	const open = async () => {
		if (disabled) return;
		activatorWidth = activatorElem.firstElementChild.clientWidth;
		await tick();
		onopen?.();
	};

	const menuClick = () => {
		if(!closeOnClick) return
		active = false;
		close();
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
	
	const shouldClose = ({detail:event}: CustomEvent<Event & {target:HTMLElement}>) => {
		if(!menu) return;
		const childrenMenus = menu.querySelectorAll('.s-menu__activator');
		const include = [...childrenMenus].map(element => `#${element.id}.s-menu`);
		if(include.some(element=> event.target.closest(element)))
		return;
		active = false ;
		hovered = false;
	};
</script>

	<!-- svelte-ignore a11y_mouse_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="s-menu__activator"
		{id}
		bind:this={activatorElem}
		onpointerenter={handleMouseEnter}
		onpointerleave={handleMouseLeave}
		onclick={() => openOnClick && (active = true)}
		onkeypress={() => openOnClick && (active = true)}
		oncontextmenu={preventDefault(() => rightClick && (active = true)  && (hovered=false))}
		style="display:contents;"
	>
		{@render activator?.()}
	</div>

	{#if active || hovered}
		<!-- svelte-ignore a11y_mouse_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			{id}
			use:portal={activatorElem.closest("dialog") ??  ".s-app"}
			use:clickOutside={{include:[activatorElem]}}
			onclickOutside={shouldClose}
			transition:fade|global={{ duration: 300 }}
			bind:this={menu}
			onpointerenter={handleMouseEnter}
			onpointerleave={handleMouseLeave}
			onclose={(event)=> {event.stopPropagation(); close()}}
			onclick={menuClick}
			onkeydown={menuClick}
			use:popperContent={{ position: placement }}
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
		</div>
	{/if}
