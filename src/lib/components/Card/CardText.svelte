<script lang="ts">
  let klass:string = '';
  export { klass as class };
  export let style:string = null;
</script>

<style lang="scss" src="./CardText.scss" global>
</style>

<div class="s-card-text {klass}" {style}>
  <slot />
</div>
