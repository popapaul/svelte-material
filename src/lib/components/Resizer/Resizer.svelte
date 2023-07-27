<script context="module">
  import {createEventDispatcher} from "svelte"
</script>

<script lang="ts">
 
  // Add class to switch wrapper.
  let klass = '';
  export { klass as class };

  // Styles to add to switch.
  export let style:string = null;

	
	export let width:string|number=null;
	export let x = 20
	
  const dispath = createEventDispatcher();
	let expanding = null
	let start = null, 
  	initial = null;
	
	function startExpand(type:string, event:MouseEvent) {
		expanding = type
		start = event.pageX
		initial = { x, width }
	}
	
	function stopExpand() {
		expanding = null
		start = null
		initial = null
	}
	
	function expand(event:MouseEvent) {
		if (!expanding) return
		
		if (expanding == 'left') {
			const delta = start-event.pageX
			x = initial.x - delta
			width = initial.width + delta;
      		dispath("width",width);
			return
		}
		
		if (expanding == 'right') {
			const delta = event.pageX-start
			width = initial.width + delta
      		dispath("width",width);
			return
		}
	}
</script>

<style lang="scss" src="./Switch.scss" global>
</style>

<svelte:window on:mouseup={stopExpand} on:mousemove={expand}/>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div bind:clientWidth={width} class="s-resizer {klass}"  {style} >
     <div  class="s-resize-handle resize-left" on:mousedown={event=>startExpand('left',event)}></div>
    <slot />
    <div class="s-resize-handle resize-right" on:mousedown={event=>startExpand('right',event)}></div>
</div>
