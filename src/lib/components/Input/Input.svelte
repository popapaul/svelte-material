<script lang="ts">
  import TextColor from '../../internal/TextColor';
  import "./Input.scss";

  let klass = '';
  /** classes added to the input */
  export { klass as class };
  /** color of the input */
  export let color = null;
  /** makes the input dense */
  export let dense = false;
  /** makes the input readonly */
  export let readonly = false;
  /** disables the input */
  export let disabled:boolean = false;

  export let error:boolean = false;

  export let success:boolean = false;

  export let style:string = null;
</script>

<div
  class="s-input {klass}"
  class:dense
  class:error
  class:success
  class:readonly
  class:disabled
  {style}
  use:TextColor={ error ? 'error' : color}>
  <slot name="prepend-outer" />
  <div class="s-input__control">
    <div class="s-input__slot">
      <slot />
    </div>
    <div class="s-input__details">
      <slot name="messages" />
    </div>
  </div>
  <slot name="append-outer" />
</div>
