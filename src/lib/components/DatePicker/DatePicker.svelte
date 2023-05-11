<script context="module" lang="ts">
  export type DateMode = "days" | "month" | "year";
</script>


<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { isDate } from "../../internal/Date/date";
    import Day from "./Day.svelte";
    import Month from "./Month.svelte";
    import Year from "./Year.svelte";
    
    export let locale: string = "ro";
    export let isAllowed: (date: Date) => boolean = () => true;
    export let header: boolean = true;
    export let value: Date = null;
    export let noDateText: string = "No Date"
    export let mode:DateMode = "days";
    
    const dispatch = createEventDispatcher();
    
    let month;
    let year;
    let elm;

    let d = isDate(value) ? new Date(value?.getTime?.() || value) : new Date();
  
    month = d.getMonth();
    year = d.getFullYear();
    $: if (elm) {
      setTimeout(() => {
        if (elm) {
          elm.style.height = elm.offsetHeight + "px";
          elm.style.width = elm.offsetWidth + "px";
        }
      }, 0);
    }
    function onView({ detail }) {
      mode = detail.type;
    }
    function onYear({ detail }) {
      year = +detail.year;
      mode = "month";
    }
    function onMonth({ detail }) {
      month = +detail.month;
      year = +detail.year;
      mode = "days";
    }
    function onDay({ detail }) {
      value = new Date(detail.getTime());
      dispatch("change", value);
    }

  </script>
  
  <div class="datepicker">
    {#if header}
      <div class="header">
        {#if isDate(value)}
          <div class="year">{("000" + value.getFullYear()).slice(-4)}</div>
          <div class="wrap">
            <div class="date">
              {new Intl.DateTimeFormat(locale, {
                weekday: "long",
                month: "short",
                day: "numeric",
              }).format(value)}
            </div>
          </div>
        {:else}
          <div class="year">&nbsp;</div>
          <div class="date">{noDateText}</div>
        {/if}
      </div>
    {/if}
    <div class="body" bind:this={elm}>
      {#if mode === "year"}
        <Year {year} on:select={onYear} />
      {:else if mode === "month"}
        <Month {locale} bind:year {value} on:select={onMonth} on:changeView={onView} />
      {:else}
        <Day {locale} {isAllowed} bind:month bind:year {value} on:select={onDay} on:changeView={onView} />
      {/if}
    </div>
  </div>
  
  <style>
    .datepicker {
      position: relative;
      overflow: hidden;
    }
    .header {
      box-sizing: border-box;
      color: #fff;
      color: var(--alternate, #fff);
      background: #1976d2;
      background: var(--primary, #1976d2);
      padding: 16px;
      height: 97px;
    }
    .wrap {
      position: relative;
    }
    .wrap .date {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
       text-overflow: ellipsis; 
      white-space: nowrap;
    }
    .year {
      font-size: 16px;
      font-weight: 700;
      opacity: 0.6;
      margin-bottom: 8px;
    }
    .date {
      font-size: 28px;
      font-weight: 500;
    }
    .body {
      overflow: hidden;
    }
    @media only screen and (max-height: 400px) and (min-width: 420px) {
      .datepicker {
        display: flex;
      }
      .header {
        height: auto;
        width: 148px;
      }
      .wrap .date {
        white-space: unset;
      }
    }
  </style>