<script context="module">
  import uid from '../../internal/uid';

  const check = 'M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z';
  const dash = 'M4,11L4,13L20,13L20,11L4,11Z';
</script>

<script lang="ts">
  import { ripple as Ripple } from '../../actions/Ripple';
  import TextColor from '../../internal/TextColor';
  import { getContext } from 'svelte';
  import { FORM_FIELDS, type FormContext } from '../Form/Form.svelte';

  const context = getContext<FormContext>(FORM_FIELDS);

  interface $$Events {
    change: Event & { target: EventTarget & HTMLInputElement};
  }

  // Add class to checkbox wrapper.
  let klass:string = '';
  export { klass as class };

  // Class to add to checkbox when it is checked or indeterminate.
  export let color:string = 'primary';

  // Get/Set checked state.
  export let checked:boolean  = false;

  // Get/Set indeterminate state.
  export let indeterminate:boolean  = false;

  // Make the checkbox disabled.
  export let disabled:boolean = false;

    /**
   * A list of validator functions that take the text field value and return an error
   * message, or `true` otherwise.
   */
  export let rules:((value: string) => string)[] = [];

  // The value for the checkbox.
  export let value:any|any[] = null;

  // Combines components into a single group.
  export let group:any[] = null;

  // Id for the checkbox, defaults to a random uid.
  export let id:string = null;

  // Styles to add to checkbox.
  export let style:string = null;

  // The <input/> element of the checkbox.
  export let inputElement:HTMLInputElement = null;

  let error:boolean=false;

  id = id || `s-checkbox-${uid(5)}`;


  let errorMessages:string[] = [];

  export function validate() 
  {
    errorMessages = rules.map((r) => r(checked ? "true" : "")).filter((r) => typeof r === 'string');
    error = !!errorMessages.length;
    return errorMessages;
  }

  context?.register({id, validate});

  $: hasValidGroup = Array.isArray(group);
  $: if (hasValidGroup && value != null) {
    checked = group.indexOf(value) >= 0;
  }

  function groupUpdate() {
    if (hasValidGroup && value != null) {
      const i = group.indexOf(value);
      if (i < 0) {
        group.push(value);
      } else {
        group.splice(i, 1);
      }
      group = group;
    }
  }
</script>

<style lang="scss" src="./Checkbox.scss" global>
</style>

<div class="s-checkbox {klass}" {style}>
  <div
    class="s-checkbox__wrapper "
    class:disabled
    use:Ripple={{ centered: true }}
    use:TextColor={error ? 'error' : color}
    use:TextColor={checked || indeterminate ? color : false}>
    <input
    {...$$restProps}
      type="checkbox"
      bind:this={inputElement}
      aria-checked={checked}
      bind:checked
      bind:indeterminate
      {id}
      {disabled}
      {value}
      on:change={groupUpdate}
      on:change={validate}
      on:change />
    <div class="s-checkbox__background" aria-hidden="true">
      {#if checked || indeterminate}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24">
          <path d={checked ? check : dash} />
        </svg>
      {/if}
    </div>
  </div>
  <div style="display:flex;flex-direction:column"  use:TextColor={error ? 'error' : color}>
    <label for={id}>
      <slot />
    </label>
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label>
      {#each errorMessages.slice(0, 1) as message}<span>{message}</span>{/each}
    </label>
  </div>
</div>
