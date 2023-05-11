<script lang="ts">
	import { intersect, type IntersectOptions } from '../../actions/Intersect';
  export let options:IntersectOptions;
  let intersecting = false;
  let klass = '';
	/** Classes to add to wrapper. */
	export { klass as class };
</script>
  
<div class={klass} {...$$restProps} use:intersect={options} on:intersect={({detail:{isIntersecting}})=>intersecting = isIntersecting}>
    <slot {intersecting}/>
</div>