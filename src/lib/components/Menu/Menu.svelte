<script lang="ts">
	import { createPopperActions, type NanoPopPosition } from '../../actions/Popper';
	import { setContext, createEventDispatcher, onMount } from 'svelte';
	import './Menu.scss';
	import { clickOutside } from '../../actions/ClickOutside';

	let klass: string = '';
	/** Classes to add to menu. */
	export { klass as class };
	/** The menu's active state. */
	export let active = false;
	/** Designates whether menu should open and close on activator hover. */
	export let hover = false;
	/** Designates if menu should close when its content is clicked. */
	export let closeOnClick = true;
	/** Aligns the component with respect to its bottom. */
	/** Removes the border radius. */
	export let tile = false;
	/** Disables the menu. */
	export let disabled = false;
	/** The desired position of the menu */
	export let placement: NanoPopPosition = 'bottom-middle';
	/** Styles for the menu. */
	export let style = '';

	export let rightClick = false;
	export let fullWidth: boolean = false;

	export let nudgeX: number = 0;
	export let nudgeY: number = 0;
	let activatorWidth = 0;
	let activator: HTMLButtonElement;
	let menu: HTMLElement;
	let clicked = false;
	const dispatch = createEventDispatcher();

	setContext('S_ListItemRole', 'menuitem');
	setContext('S_ListItemRipple', true);

	const [popperRef, popperContent] = createPopperActions();

	onMount(()=>{
		const target = activator.firstElementChild as HTMLElement;

		const { destroy } = popperRef(target);
		return destroy;
	})
	$: active ? menu?.showPopover() : menu?.hidePopover();
	const close = () => {
		active = false;
		clicked = false;
		dispatch('close');
	};
	
	const open = () => {
		if (disabled) return;

		activatorWidth = activator.firstElementChild.clientWidth;
		active = true;
		dispatch('open');
	};

	const menuClick = () => {
		closeOnClick && close();
	};
	const activatorClick=()=>{
		clicked=true;
		open();
	}
</script>


<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div use:clickOutside on:clickOutside={close} on:mouseleave={()=>!clicked && hover && close()} style="display:contents">
	<button type="button" bind:this={activator} on:mouseenter={()=> hover && open()} 
		on:click={()=>!rightClick && activatorClick()}
		on:keydown={()=>!rightClick && activatorClick()} 
		on:contextmenu|preventDefault={()=>rightClick && activatorClick()}
		popovertargetaction="show" style="display:contents;" >
		<slot name="activator" />
	</button>

	<div
		use:popperContent={{position:placement}}
		bind:this={menu}
		popover="manual"
		{style}
		class="s-menu {klass}"
		style:width={fullWidth ? activatorWidth+"px" : null}
		style:margin-right="{nudgeX}px"
		style:margin-top="{nudgeY}px"
		style:margin-left="{0}px"
		style:margin-bottom="{0}px"
		role="menu"
		tabindex="0"
		class:tile
		on:click={menuClick}
		on:keydown={menuClick}
	>
		<slot />
	</div>
</div>
