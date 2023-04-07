<script lang="ts">
	import { intersect, type IntersectOptions } from '../../actions/Intersect';
  export let options:IntersectOptions;
  let intersecting = false;

</script>
  
<div {...$$restProps} use:intersect={options} on:intersect={({detail:{isIntersecting}})=>intersecting = isIntersecting}>
    <slot {intersecting}/>
</div>