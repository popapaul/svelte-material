<script lang="ts">
  import "./Divider.scss";
  let klass:string = '';
  /** classes added to the divider */
  export { klass as class };
  /** inset moves divider 72px to the right */
  export let inset:boolean = false;
  /** vertical makes divider to a vertical divider */
  export let vertical:boolean = false;
  /** styles added to the divider */
  export let style:string = null;

</script>


<hr
  class="s-divider {klass}"
  aria-orientation={vertical ? 'vertical' : 'horizontal'}
  class:inset
  class:vertical
  {style} />
