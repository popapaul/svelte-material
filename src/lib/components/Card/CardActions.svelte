<script lang="ts">
  let klass:string = '';
  /** classes added to the card actions */
  export { klass as class };
  /** styles added the card actions */
  export let style:string = null;
</script>

<style lang="scss" src="./CardActions.scss" global>
</style>

<div class="s-card-actions {klass}" {style}>
  <slot />
</div>
