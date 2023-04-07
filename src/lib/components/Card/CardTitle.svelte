<script lang="ts">
  let klass:string = '';
  export { klass as class };
  export let style:string = null;
</script>

<style lang="scss" src="./CardTitle.scss" global>
</style>

<div class="s-card-title {klass}" {style}>
  <slot />
</div>
