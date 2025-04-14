import { formatDate } from "./dateUtils";

/**
 * @typedef {object} ValueInit
 * @property {string[]} iValues
 * @property {string|null} iValueCombined
 * @property {Date[]} iDates
 */

/**
 * Init internal props
 */
export function initProps(value:Date|Date[], format:string, i18n:any, formatType: "php" | "standard") {
  const iDates = (Array.isArray(value) ? value : [value] ).filter(Boolean);
  let valueArray = iDates.map(val=> formatDate(val, format, i18n, formatType));  // for range we can get combined string 

  // strip seconds if present in initial value
  valueArray = valueArray.map(value => value.replace(/(:\d+).*/, "$1"));

  return {
    iValues: valueArray,
    iValueCombined: valueArray.length ? valueArray.join() : null,
    iDates: iDates.map(date=> new Date(date)),
  }
}

/**
 * FUTURE: test that this works for PHP format type as well
 *
 * @param {'auto'|'date'|'datetime'|'time'} mode
 * @param {string} format
 * @returns {'date'|'datetime'|'time'}
 */
export function computeResolvedMode(mode, format) {
  return mode === "auto"
    ? format.match(/g|hh?|ii?/i) && format.match(/y|m|d/i)
      ? "datetime"
      : format.match(/g|hh?|ii?/i)
      ? "time"
      : "date"
    : mode;
}