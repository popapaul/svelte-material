<script lang="ts">
  let klass:string = '';
  export { klass as class };
  export let style:string = null;
</script>

<style lang="scss" src="./CardSubtitle.scss" global>
</style>

<div class="s-card-subtitle {klass}" {style}>
  <slot />
</div>
