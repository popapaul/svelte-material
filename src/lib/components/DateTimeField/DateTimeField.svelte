<script module>
    export const config = {
        theme: 'sdt-calendar-colors',
        format: 'yyyy-mm-dd',
        formatType: 'standard',
        displayFormat: null,
        displayFormatType: null,
        minuteIncrement: 1,
        weekStart: 1,
        hourOnly: false,
        todayBtn: true,
        clearBtn: true,
        clearToggle: true,
        autocommit: true,
        i18n: getLocalizedData("ro")
    };
  </script>
  
  <script lang="ts">
    import { Cancel, CalendarToday, Clear, Check } from "@paulpopa/icons/md/outlined"
    import type {  ComponentProps } from "svelte";
    import { fade } from "svelte/transition";
    import { SvelteDate } from "svelte/reactivity";
    import Calendar from "./Calendar.svelte";
    import Time from "./Time.svelte";
    import { formatDate, getLocalizedData, parseDate } from "./utils/dateUtils";
    import { computeResolvedMode, initProps } from "./utils/state";
    import { MODE_MONTH, type UpdateProp } from "./utils/constants";
    import TextField from "../TextField/TextField.svelte";
    import Menu from "../Menu/Menu.svelte";
    import Button from "../Button/Button.svelte";
    import Icon from "../Icon/Icon.svelte";
  
    type Props = Omit<ComponentProps<TextField<string>>, "value"> & {
        disabled?: boolean;
        placeholder?: string;
        required?: boolean;
        value?: Date | Date[];
        isRange?: boolean;
        startDate?: Date | string;
        endDate?: Date | string;
        pickerOnly?: boolean;
        startView?: number;
        mode?: 'auto' | 'date' | 'datetime' | 'time';
        disableDatesFn?: ((currentDate: Date) => boolean);
        manualInput?: boolean;
        theme?: string;
        format?: string;
        formatType?: string;
        displayFormat?: string;
        displayFormatType?: string;
        minuteIncrement?: number;
        weekStart?: number;
        todayBtn?: boolean;
        clearBtn?: boolean;
        clearToggle?: boolean;
        autocommit?: boolean;
        hourOnly?: boolean;
        i18n?: import('$lib/i18n/index.js').i18nType;
        onChange?: (value: Date | Date[]) => void;
        onDateChange?: (prop: import('$lib/types/internal.js').DateChange) => void;
        onCancel?: () => void;
        onBlur?: () => void;
        onInput?: (currentValue: string) => void;
        actionRow?: import('svelte').Snippet<[
            {
            autocloseSupported: boolean;
            onCancel: Function;
            onConfirm: Function;
            onClear: Function;
            onToday: Function;
            isTodayDisabled: boolean;
            i18n: import('$lib/i18n/index.js').i18nType;
            currentMode: string;
            }
        ]>;
        children?: import('svelte').Snippet;
    };

    let {
      disabled = false,
      placeholder = null,
      required = false,
      value = $bindable(null),
      isRange = false,
      startDate = null,
      endDate = null,
      pickerOnly = false,
      startView = MODE_MONTH,
      mode = 'auto',
      disableDatesFn = null,
      manualInput = false,
      theme = config.theme,
      format = config.format,
      formatType = config.formatType,
      displayFormat = config.displayFormat,
      displayFormatType = config.displayFormatType,
      minuteIncrement = config.minuteIncrement,
      weekStart = config.weekStart,
      todayBtn = config.todayBtn,
      clearBtn = config.clearBtn,
      clearToggle = config.clearToggle,
      autocommit = config.autocommit,
      hourOnly = config.hourOnly,
      i18n = config.i18n,
      onChange,
      onDateChange,
      onCancel,
      onInput,
      onBlur,
      actionRow = action_row,
      children,
      ...rest
    }:Props = $props();
  
    if (isRange && Array.isArray(value) === false) console.warn('[svelty-picker] value property must be an array for range picker');
  
    const { iDates, iValues, iValueCombined} = initProps(value, format, i18n, formatType);
    /** @type {string|null} concated by `join()` */
    let prev_value = iValueCombined;
    let value_array = $state(iValues);
    let innerDates = $state<SvelteDate[]>(iDates.map(date => new SvelteDate(date)));
    // svelte-ignore state_referenced_locally
    let undoHistory = $state(iValues);
    /** @type {string|null} @computed */

    let value_display = $state(computeDisplayValue());
    // svelte-ignore state_referenced_locally
    let currentFormat = format;
    let currentDisplayFormat = displayFormat;
    /** @type {number?} as a timestamp */
    let calendarHoverDate = $state<number>(null);
    let parsedStartDate = $derived(startDate ? parseDate(startDate, format, i18n, formatType) : null);
    let parsedEndDate = $derived(endDate ? new Date(parseDate(endDate, format, i18n, formatType).setSeconds(1)) : null);
    let isTodayDisabled = $derived((parsedStartDate && parsedStartDate > new Date()) || (parsedEndDate && parsedEndDate < new Date()));

    let initiallyResolvedMode = computeResolvedMode(mode, format);
    let resolvedMode = $state(initiallyResolvedMode);
    /** @type {'date'|'time'} */
    let currentMode = $state(initiallyResolvedMode === 'time' ? "time" : "date");
    /**
     * @type {Array<{ ref: import('./Time.svelte').default }>}
     */
    // @ts-ignore
    let widgetList = $state(
      isRange
        ? [{ref: null}, {ref: null}]
        : [{ref: null}]
    );
    /** @type {'date'|'datetime'|'hour'|'minute'}*/
    let lastEventType = $state('date');
    let autocloseSupported = $derived(autocommit && ((isRange && resolvedMode === 'date') || !isRange));
    /** popup visibility state */
    let isFocused = $state(pickerOnly);
    let pickerVisible = $state(false);
    let fadeFn = pickerOnly ? () => ({}) : fade;
    let internalVisibility = $derived(pickerOnly ? true : false);

    let isDirty = $derived(autocommit ? false : value_array.join() !== undoHistory.join());

    // svelte-ignore non_reactive_update
    let ref_calendar: Calendar;
  

    function computeDisplayValue() {
      return innerDates
        .sort((date1, date2) => date1.getTime() - date2.getTime())
        .map(innerDate => formatDate(innerDate, displayFormat || format, i18n, displayFormatType || formatType))
        .join(' - ');
    }
  

    function computeValue() {
      return isRange
        ? (innerDates.length === 2 ? innerDates : null) // for range set value only when full
        : (innerDates[0] || null);
    }
  
 
    function onDate({ type, date, isKeyboard, dateIndex = 0 }:UpdateProp) {
      if (date && !isRange && innerDates.length) {
        if (
          innerDates[0].getFullYear() === date.getFullYear() &&
          innerDates[0].getMonth() === date.getMonth() &&
          innerDates[0].getDate() === date.getDate() &&
          resolvedMode === "date" && !required && clearToggle
        )
          // @ts-ignore
          date = null;
      }
      // standard
      if (isRange) {
        // need to keep daterange sorted
        if (type === 'date') {
          innerDates = date
            ? (innerDates.length === 2 ? [new SvelteDate(date)] : innerDates.concat(new SvelteDate(date)))
              .map(date => date.getTime())
              .sort().map(ts => new SvelteDate(ts))
            : [];
        } else if (date && dateIndex !== undefined) {
          innerDates[dateIndex] = new SvelteDate(date);
        } else if (type === 'datetime') {
          innerDates[0] = new SvelteDate(date);
          innerDates[1] = new SvelteDate(date);
        } else {
          throw new Error(`Unhandled event type: '${type}'`);
        }
        value_array = innerDates.map(date => formatDate(date, format, i18n, formatType));
      } else {
        // single select
        innerDates = date
          ? [new SvelteDate(date)]
          : [];
        value_array = date
          ? [formatDate(date, format, i18n, formatType)]
          : [];
      }
      lastEventType = type;
      shouldEmitChange(type) && setValueAndEmitEvents();
      wrapInteraction(type, isKeyboard, dateIndex);
    }
  
    /**
     * Previously as doAutoCommit
     */
    function shouldEmitChange(event: 'date'|'datetime'|'hour'|'minute') {
      if (!autocommit || (isRange && resolvedMode.includes('time'))) return false; // no doubt
  
      if (isRange && (resolvedMode === 'datetime' || value_array.length !== 2)) return false;
  
      return event === 'minute'
        || event === resolvedMode
        || (event === 'hour' && hourOnly)
        || (pickerOnly) //  here we need to emit on every change, because there is no 'blur' action
      ;
    }
  
    function setValueAndEmitEvents() {
      prev_value = value_array.join();
      undoHistory = [...value_array];
      value_display = computeDisplayValue();
      value = computeValue();
      // events
      onChange?.(isRange ? innerDates : (innerDates[0] || null));    // change is dispatched on user interaction
      onDateChange?.({
        value: isRange ? value_array : (value_array[0] || null),
        dateValue: isRange ? innerDates : (innerDates[0] || null),
        displayValue: value_display,
        valueFormat: format,
        displayFormat: displayFormat,
        event: lastEventType
      });
    }
  
  
    function resetView() {
      startView = MODE_MONTH;
      if (resolvedMode === 'datetime') {
        setTimeout(() => {
          if (!pickerOnly) pickerVisible = false;
           currentMode = "date";
        }, autocommit ? 300 : 0);
      } else if (!pickerOnly) pickerVisible = false;
    }
  
  
    /**
     * Should list all cases, when resetView should NOT be called
     *
     * @param {'date'|'datetime'|'hour'|'minute'} type
     * @param {boolean} isKeyboardEvent
     * @param {number} dateIndex
     */
    function wrapInteraction(type, isKeyboardEvent, dateIndex) {
      if (isKeyboardEvent && lastKeyPressed !== 'Enter') return;
      if (type === 'hour' && !hourOnly) {
        widgetList[dateIndex].ref.showMinuteView();
        return;
      }
  
      const doAutoCommit = shouldEmitChange(type);
  
      if (resolvedMode === 'datetime') {
        if (type === 'minute' && !isRange && resolvedMode === 'datetime' && doAutoCommit) {
          // intentionally empty, because under these conditions we want to reset view
        } else {
          if (type === 'date' && ((isRange && value_array.length === 2) || !isRange)) {
            currentMode = 'time';
          }
          return; // prevent reset
        }
      }
  
      doAutoCommit && !isKeyboardEvent && resetView();
    }
  
    // TODO: check the 'datetime' type for 'datetime' range
    function onToday() {
      const now = new Date();
      onDate({
        type: isRange ? 'datetime' : 'date',
        dateIndex: 0,
        date: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          0,
          0,
          0
        ),
        isKeyboard: false
      });
      if (isRange) {
              onDate({
          type: isRange ? 'datetime' : 'date',
          dateIndex: 1,
          date: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999),
          isKeyboard: false
        });
          }
      shouldEmitChange('date') === false && setValueAndEmitEvents();
      resolvedMode === 'date' && resetView();
    }
  
    function onClear() {
      innerDates = [];
      value_array = [];
      prev_value = null;
      setValueAndEmitEvents();
    }
  
    /**
     * pressing 'Ok' button
     */
     function onConfirm() {
      const stringValue = Array.isArray(value) ? value.join() : (value || null);
      if (prev_value !== stringValue || (autocommit === false || isRange)) {
        setValueAndEmitEvents();
      }
      resetView();
    }
  
    /**
     * Dismiss any edits
     */
     function onCancelFn() {
      value_array = [...undoHistory];
      // currentValue = computeStringValue();
      resetView();
      onCancel?.();
    }
  
    let lastKeyPressed = null;
  

    function onKeyDown(e: KeyboardEvent) {
      if (!pickerVisible) {
        ["Backspace", "Delete"].includes(e.key) && !required && onClear();
        if (e.key === 'Enter') onInputFocus();
      }
      if (!pickerVisible && e.key !== 'Tab') {
        pickerVisible = e.key !== 'Shift';
        e.preventDefault();
        return;
      }
      lastKeyPressed = e.key;
      switch (e.key) {
        case "PageDown":
        case "PageUp":
        case "ArrowDown":
        case "ArrowUp":
        case "ArrowLeft":
        case "ArrowRight":
          e.preventDefault();
          if (isRange) return;
          if (currentMode === "date") {
            ref_calendar.handleGridNav(e.key, e.shiftKey);
          } else {
            // @ts-ignore
            widgetList[0].ref.makeTick(
              ["ArrowDown", "ArrowLeft", "PageDown"].includes(e.key) ? -1 : 1
            );
          }
          break;
        case "Escape":
          autocommit ? onClear() : onCancelFn();
          break;
        case "Backspace":
          if (manualInput && !isRange) return;
        case "Delete":
          !required && onClear();
          break;
        case "Enter":
          isFocused && e.preventDefault();
          if (value_array.length === 0) {
            pickerVisible = false;
            return;
          }
          if (currentMode === "time" && lastEventType === 'hour') {
            return widgetList[0].ref.showMinuteView();
          }
          if (resolvedMode === 'datetime' && currentMode !== 'time') {
            currentMode = 'time';
            return;
          }
          onConfirm();
  
          break;
        case "Tab":
          if (pickerVisible) {
            pickerVisible = false;
            e.preventDefault();
          }
        case "F5":
          break;
        default:
          !manualInput && e.preventDefault();
      }
    }
  
    function onManualInput(event: Event & { currentTarget: HTMLInputElement}) {
      event.preventDefault();
      event.stopPropagation();
      const parsedInput = parseDate(event.currentTarget.value, displayFormat || format, i18n, displayFormatType || formatType);
      const formattedInput = formatDate(parsedInput, displayFormat || format, i18n, displayFormatType || formatType);
      if (formattedInput === event.currentTarget.value) {
        onDate({
            type: 'date',
            date: parsedInput,
            isKeyboard: true
        });
        ref_calendar.focusDate(parsedInput);
      }
    }
  

    function onModeSwitch(mode: string) {
      startView = MODE_MONTH;
      currentMode = mode;
    }
  
    let inputMode = $state(manualInput ? 'text' : 'none');
  
    function onInputClick() {
      if (manualInput && isFocused) inputMode = inputMode === 'text'
        ? 'none'
        : 'text';
      !pickerVisible && onInputFocus();
    }
  
    function onInputFocus() {
      isFocused = true;
      pickerVisible = true;
    }
  
    function onInputBlur() {
      isFocused = false;
      if (autocloseSupported) {
        onConfirm();
      } else {
        onCancelFn();
      }
      onBlur?.();
    }
  
  
    /**
     * @param {number} date
    */
    function updateCalendarHoverDate(date) {
      calendarHoverDate = date;
    }
  

  
    /**
     * effects: parent reactivity listeners
     */
  
    /**
     * @param {string|string[]|null} passedValue
     */
     function watch_value(passedValue) {
      const stringValue = Array.isArray(passedValue) ? passedValue.join() : (passedValue || null);
      if (prev_value !== stringValue) {
        value_array = passedValue
          ? (Array.isArray(passedValue)
            ? passedValue
            : [passedValue]
          )
          : [];
        innerDates = value_array
          .map(val => new SvelteDate(parseDate(val, format, i18n, formatType)));
        undoHistory = value_array;
        prev_value = stringValue;
      }
    }
  
    /**
     * @param {string} format
     * @param {string|null} displayFormat - not used, but included to track also its' changes
     */
    function watch_formats(format, displayFormat) {
      if (currentDisplayFormat !== displayFormat) {
        currentDisplayFormat = displayFormat;
        value_display = computeDisplayValue();
      }
      if (currentFormat !== format && innerDates.length) {
        currentFormat = format;
        value_array = innerDates.map(date => formatDate(date, format, i18n, formatType));
        prev_value = value_array.join();
        if (currentDisplayFormat === null && currentDisplayFormat === displayFormat) {
          value_display = computeDisplayValue();
        }
        if (mode === "auto") {
          resolvedMode =
            format.match(/g|hh?|ii?/i) && format.match(/y|m|d/i)
              ? "datetime"
              : format.match(/g|hh?|ii?/i)
              ? "time"
              : "date";
          if (resolvedMode === 'time' && currentMode !== 'time') {
            currentMode = 'time';
          }
        }
        setValueAndEmitEvents();
      }
    }
  
    $effect(() => watch_value(value));
    $effect(() => watch_formats(format, displayFormat));
  </script>
  
  {#snippet action_row({
    onCancel,
    onConfirm,
    onClear,
    onToday,
    isTodayDisabled,
    currentMode
  })}
      <div class="sdt-btn-row">
        <span>
          <Button 
            class="error-color"
            depressed
            onclick={onCancel}
            size="small"
          >
            <Icon path={Cancel}/>
          </Button>
          <Button
            class="success-color"
            depressed
            size="small"
            onclick={onConfirm}
          >
            <Icon path={Check}/>
          </Button>
        </span>
        <span>
          {#if currentMode === 'date'}
            <Button  
              depressed
              size="small"
              class="info-color"
              onclick={onToday}
              disabled={isTodayDisabled}
            >
              <Icon path={CalendarToday}/>
            </Button>
          {/if}
            <Button
               depressed
              size="small"
 
              onclick={onClear}
            >
               <Icon path={Clear}/>
            </Button>
        </span>
        
      </div>

  {/snippet}
  
    <Menu active={pickerVisible} closeOnClick={false} placement="bottom-start">
        {#snippet activator()}
            {#if !pickerOnly}
              <TextField
                class="{rest.class} {isDirty ? "value-dirty":""}"
                value={value_display}
                {placeholder}
                {disabled}
                {required}
                autocomplete="off"
                onclick={onInputClick}
                readonly={isFocused && !manualInput && !isRange}
                oninput={manualInput ? onManualInput : () => {}}
                onfocus={onInputFocus}
                onblur={onInputBlur}
                onkeydown={onKeyDown}
                {children}
                {...rest}
              />
              {:else}
              {@render children?.()}
            {/if}
        {/snippet}
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div
          class="sdt-calendar-wrap {theme}"
          class:is-popup={!internalVisibility}
          class:is-range-wrap={isRange}
          transition:fadeFn={{ duration: 200 }}
          onmousedown={e => e.preventDefault() }
        >
        <div class="sdt-widget-wrap">
        {#each widgetList as w, i (i)}
          <div class="sdt-widget">
          {#if currentMode === "date"}
            <Calendar
              wid={i}
              dates={innerDates}
              {isRange}
              startDate={parsedStartDate}
              endDate={parsedEndDate}
              enableTimeToggle={resolvedMode?.includes("time")}
              initialView={startView > 2 ? 2 : startView}
              hoverDate={calendarHoverDate}
              additionalDisableFn={disableDatesFn}
              bind:this={ref_calendar}
              {i18n}
              {weekStart}
              onupdate={onDate}
              onswitch={onModeSwitch}
              onhoverupdate={updateCalendarHoverDate}
            />
          {:else}
            <Time
              wid={i}
              date={innerDates[i] || null}
              startDate={isRange && i === 1 ? innerDates[0] : parsedStartDate}
              endDate={parsedEndDate}
              hasDateComponent={resolvedMode !== "time"}
              bind:this={w.ref}
              showMeridian={format.match(formatType === 'php' ? 'a|A' : 'p|P') !== null}
              {i18n}
              {minuteIncrement}
              {hourOnly}
              onupdate={onDate}
              onswitch={onModeSwitch}
            />
          {/if}
          </div>
          {/each}
        </div>
        {@render actionRow({ autocloseSupported, onCancel: onCancelFn, onConfirm, onClear, onToday, isTodayDisabled, i18n, currentMode })}
        </div> <!-- END: popup -->
    </Menu>
  
  
  <style>
    .sdt-calendar-wrap {
      width: 280px;
      background-color: var(--sdt-bg-main, #fff);
      box-shadow: var(--sdt-wrap-shadow, 0 1px 6px var(--sdt-shadow-color, #ccc));
      border-radius: var(--sdt-radius, 4px);
      padding: 0.5em;
      color: var(--sdt-color, initial);
    }
    .sdt-calendar-wrap.is-range-wrap {
      width: 560px;
    }
    .sdt-widget-wrap {
      display: flex;
      gap: 0.5rem;
      justify-content: stretch;
      position: relative;
    }
    .sdt-widget {
      flex: 1;
      min-width: 264px;
    }
    .value-dirty {
      color: color-mix(in srgb, black 20%, white);
    }
    .sdt-calendar-wrap.is-popup {
      --position: absolute;
      box-shadow: 0 1px 6px var(--sdt-shadow-color, #ccc);
      z-index: 100;
    }
    .sdt-btn-row {
      margin-top: 0.5rem;
      display: flex;
      gap: 0.5rem;
      justify-content: space-between;
      flex-flow: row-reverse;
    }
    .sdt-action-btn {
      padding: 0.25em 0.5em;
      font-size: 0.875em;
      border-radius: 0.2em;
    }

    .sdt-widget + .sdt-widget:before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 50%;
      width: 1px;
      background-color: #eee;
    }
    @media screen and (max-width: 560px) {
      .sdt-calendar-wrap.is-range-wrap {
        width: 280px;
      }
      .sdt-widget-wrap {
        flex-wrap: wrap;
      }
      .sdt-widget + .sdt-widget:before {
        content: none;
      }
    }
  </style>