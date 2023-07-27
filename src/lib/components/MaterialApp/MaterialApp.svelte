<script lang="ts">
  let klass = '';
  /** classes added to the App */
  export { klass as class };
  /** theme for the app */
  export let theme:'light' | 'dark' = 'light';
  export let style:string=null;
</script>

<style type="scss" src="./MaterialApp.scss" global></style>

<div class="s-app {klass} theme--{theme}" {style}>
  <slot />
</div>
