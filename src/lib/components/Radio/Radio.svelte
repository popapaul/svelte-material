<script context="module">
  import uid from '../../internal/uid';
</script>

<script lang="ts">
  import "./Radio.scss";
  import TextColor from '../../internal/TextColor';
  import { ripple as Ripple } from '../../actions/Ripple';
  import { FORM_FIELDS, type FormContext } from '../Form/Form.svelte';
	import { getContext } from 'svelte';

  const context = getContext<FormContext>(FORM_FIELDS);

  // Add class to radio wrapper.
  let klass = '';
  export { klass as class };

  // Color of the radio when active.
  export let color = 'primary';

  // Disables the radio.
  export let disabled = false;

  // Bind radio to a group.
  export let group:string | number | string[] | boolean = null;

  // Value for the radio.
  export let value:string | number | string[] | boolean = null;

  // Id for the checkbox.
  export let id = null;

  // Styles for the radio wrapper.
  export let style = null;

      /**
   * A list of validator functions that take the radio field value and return an error
   * message, or `true` otherwise.
   */
   export let rules:((value: any) => string)[] = [];

  // The <input/> element of the radio.
  export let inputElement = null;


  let errorMessages:string[] = [];

  export function validate() {
    errorMessages = rules.map((r) => r(group)).filter((r) => typeof r === 'string');
    return errorMessages;
  }

  const check = (_: any) =>{
    if(!rules.map((r) => r(group)).filter((r) => typeof r === 'string').length)
      errorMessages = [];
  }

  $: check(group);

  context?.register({id, validate});

  id = id || `s-radio-${uid(5)}`;
  $: active = group === value;
</script>

<div class="s-radio" {style}>
  <div
    class="s-radio__wrapper {klass}"
    class:disabled
    use:TextColor={!disabled && active && color}
    use:Ripple={{ centered: true }}>
    <input
      type="radio"
      bind:this={inputElement}
      bind:group
      on:change
      on:change={validate}
      {id}
      {value}
      {disabled} />
    <div class="s-radio__background" />
  </div>
  <div style="display:flex;flex-direction:column"  use:TextColor={!!errorMessages.length ? 'error' : color}>
    <label for={id}>
      <slot />
    </label>
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label>
      {#each errorMessages.slice(0, 1) as message}<span>{message}</span>{/each}
    </label>
  </div>
</div>
