<script lang="ts">
  import "./Breadcrumbs.scss";
interface Breadcrumb {
	disabled?: boolean;
	href?: string;
	text: string;
	class?: string;
	props?: object;
}

  let klass = '';
  /** classes added to the component */
  export { klass as class };
  /** makes the breadcrumb large */
  export let large = false;
  /** array of objects for each breadcrumb */
  export let items:Breadcrumb[] = [];
  /** styles to add to the breadcrumb */
  export let style = null;

  const defaults:Breadcrumb = {
    disabled: false,
    href: '',
    text: '',
    class: '',
    props: {},
  };

  items = items.map((x) => ({ ...defaults, ...x }));
</script>

<ul class="s-breadcrumbs {klass}" class:large {style}>
  {#each items as item, i}
    {#if i !== 0}
      <li class="divider">
        <!-- The slot used for divider -->
        <slot name="divider">/</slot>
      </li>
    {/if}
    <li>
      <slot {item}>
        <svelte:element this={item.href ? "a" : "span"}
            href={item.href}
            class="s-breadcrumb-item {item.class}"
            class:disabled={item.disabled}
            {...item.props}>
            {item.text}
        </svelte:element>
      </slot>
    </li>
  {/each}
</ul>
