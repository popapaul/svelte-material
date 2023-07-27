<script lang="ts">

  // range slider props
  export let range:"min"|"max"|boolean = false;
  export let min = 0;
  export let max = 100;
  export let step = 1;
  export let values = [(max + min) / 2];
  export let vertical = false;
  export let reversed = false;
  export let hoverable = true;
  export let disabled = false;

  // range pips / values props
  export let pipstep:number = null;
  export let all:"label"|boolean = true;
  export let first = undefined;
  export let last = undefined;
  export let rest = undefined;

  // formatting props
  export let prefix = "";
  export let suffix = "";
  export let formatter = (value:number, index:number, procentage:number) => value;

  // stylistic props
  export let focus = undefined;
  export let orientationStart = undefined;

  // methods
  export let percentOf = undefined;
  export let moveHandle = undefined;
  export let fixFloat = undefined;

  $: pipStep = pipstep || ((max - min) / step >= ( vertical ? 50 : 100 ) ? (max - min) / ( vertical ? 10 : 20 ) : 1);

  $: pipCount = (max - min) / (step * pipStep);

  $: pipVal = function(val) {
    return fixFloat( min + val * step * pipStep );
  };

  $: isSelected = function(val) {
    return values.some(v => fixFloat(v) === fixFloat(val));
  };

  $: inRange = function(val) {
    if (range === "min") {
      return values[0] > val;
    } else if (range === "max") {
      return values[0] < val;
    } else if (range) {
      return values[0] < val && values[1] > val;
    }
  };

  function labelClick(val) {
    if ( !disabled ) {
      moveHandle( undefined, val );
    }
  }
</script>

<style>
    .rangePips{
    position: absolute;
    height: 1em;
    left: 0;
    right: 0;
    bottom: -1em;
  }
  .rangePips.vertical{
    height: auto;
    width: 1em;
    left: 100%;
    right: auto;
    top: 0;
    bottom: 0;
  }
  .rangePips .pip{
    height: 0.4em;
    position: absolute;
    top: 0.25em;
    width: 1px;
    white-space: nowrap;
  }
  .rangePips.vertical .pip{
    height: 1px;
    width: 0.4em;
    left: 0.25em;
    top: auto;
    bottom: auto;
  }
  .rangePips .pipVal{
    position: absolute;
    top: 0.4em;
    transform: translate(-50%, 25%);
  }
  .rangePips.vertical .pipVal{
    position: absolute;
    top: 0;
    left: 0.4em;
    transform: translate(25%, -50%);
  }
  .rangePips .pip{
    transition: all 0.15s ease;
  }
  .rangePips .pipVal{
    transition: all 0.15s ease, font-weight 0s linear;
  }
  .rangePips .pip{
    color: lightslategray;
    color: var(--pip-text);
    background-color: lightslategray;
    background-color: var(--pip);
  }
  .rangePips .pip.selected{
    color: darkslategrey;
    color: var(--pip-active-text);
    background-color: darkslategrey;
    background-color: var(--pip-active);
  }
  .rangePips.hoverable:not(.disabled) .pip:hover{
    color: darkslategrey;
    color: var(--pip-hover-text);
    background-color: darkslategrey;
    background-color: var(--pip-hover);
  }
  .rangePips .pip.in-range{
    color: darkslategrey;
    color: var(--pip-in-range-text);
    background-color: darkslategrey;
    background-color: var(--pip-in-range);
  }
  .rangePips .pip.selected{
    height: 0.75em;
  }
  .rangePips.vertical .pip.selected{
    height: 1px;
    width: 0.75em;
  }
  .rangePips .pip.selected .pipVal{
    font-weight: bold;
    top: 0.75em;
  }
  .rangePips.vertical .pip.selected .pipVal{
    top: 0;
    left: 0.75em;
  }
  .rangePips.hoverable:not(.disabled) .pip:not(.selected):hover{
    transition: none;
  }
  .rangePips.hoverable:not(.disabled) .pip:not(.selected):hover .pipVal{
    transition: none;
    font-weight: bold;
  }
</style>

<div 
  class="rangePips" 
  class:disabled
  class:hoverable 
  class:vertical 
  class:reversed 
  class:focus 
>
  {#if ( all && first !== false ) || first }
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <span
      class="pip first"
      class:selected={isSelected(min)}
      class:in-range={inRange(min)}
      style="{orientationStart}: 0%;"
      on:click={()=>labelClick(min)}
      on:keydown={()=>labelClick(min)}
      on:touchend|preventDefault={()=>labelClick(min)}
    >
      {#if all === 'label' || first === 'label'}
        <span class="pipVal">
          {#if prefix}<span class="pipVal-prefix">{prefix}</span>{/if}{formatter(fixFloat(min),0,0)}{#if suffix}<span class="pipVal-suffix">{suffix}</span>{/if}
        </span>
      {/if}
    </span>
  {/if}

  {#if ( all && rest !== false ) || rest}
    {#each Array(pipCount + 1) as _, i}
      {#if pipVal(i) !== min && pipVal(i) !== max}
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <span
          class="pip"
          class:selected={isSelected(pipVal(i))}
          class:in-range={inRange(pipVal(i))}
          style="{orientationStart}: {percentOf(pipVal(i))}%;"
          on:click={()=>labelClick(pipVal(i))}
          on:keydown={()=>labelClick(pipVal(i))}
          on:touchend|preventDefault={()=>labelClick(pipVal(i))}
        >
          {#if all === 'label' || rest === 'label'}
            <span class="pipVal">
              {#if prefix}<span class="pipVal-prefix">{prefix}</span>{/if}{formatter(pipVal(i),i,percentOf(pipVal(i)))}{#if suffix}<span class="pipVal-suffix">{suffix}</span>{/if}
            </span>
          {/if}
        </span>
      {/if}
    {/each}
  {/if}

  {#if ( all && last !== false ) || last}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <span
      class="pip last"
      class:selected={isSelected(max)}
      class:in-range={inRange(max)}
      style="{orientationStart}: 100%;"
      on:click={()=>labelClick(max)}
      on:keydown={()=>labelClick(max)}
      on:touchend|preventDefault={()=>labelClick(max)}
    >
      {#if all === 'label' || last === 'label'}
        <span class="pipVal">
          {#if prefix}<span class="pipVal-prefix">{prefix}</span>{/if}{formatter(fixFloat(max),pipCount,100)}{#if suffix}<span class="pipVal-suffix">{suffix}</span>{/if}
        </span>
      {/if}
    </span>
  {/if}
  
</div>