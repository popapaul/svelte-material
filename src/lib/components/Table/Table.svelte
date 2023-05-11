<script lang="ts">
  let klass = '';
  export { klass as class };
  export let elevation:number=1;
  export let fixed = false;
</script>


<style lang="scss" src="./Table.scss"></style>

<div class="s-table elevation-{elevation} {klass}">
  {#if $$slots.toolbar}
    <div class="toolbar">
      <slot name="toolbar"/>
    </div>
  {/if}

  <div class="s-table-container">
    <table class:layout-fixed={fixed}>
        <slot/>
        <slot name="aggregate"/>
    </table>
  </div>

  {#if $$slots.footer}
    <div class="s-table-footer">
      <slot name="footer"/>
    </div>
  {/if}
</div>
  