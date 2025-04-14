export type i18nType = {
  months: string[];
  monthsShort: string[];
  days: string[];
  daysMin: string[];
  daysShort: string[];
  meridiem: string[];
};

type SetterMap = Record<string, (d: Date, v: number) => void>;

type ParsedFormat = {
  separators: string[];
  parts: string[];
};

function getCountryLocale(): string {
  const lang = navigator.language || 'en-US'; // fallback
  try {
    const locale = new Intl.Locale(lang);
    return locale.region ? `${locale.language}-${locale.region}` : locale.baseName;
  } catch {
    return lang;
  }
}

export type Mode = 'auto' | 'date' | 'datetime' | 'time';

export function getLocaleDateFormat(mode: Mode = 'auto', locale: string = getCountryLocale()): string {
  const optionsMap: Record<Exclude<Mode, 'auto'>, Intl.DateTimeFormatOptions> = {
    date: { year: 'numeric', month: '2-digit', day: '2-digit' },
    time: { hour: '2-digit', minute: '2-digit' },
    datetime: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    },
  };

  const resolvedMode: Exclude<Mode, 'auto'> = mode === 'auto' ? 'date' : mode;
  const options = optionsMap[resolvedMode];

  const parts = new Intl.DateTimeFormat(locale, options).formatToParts(new Date());

  // Join parts to build a format string like "yyyy-MM-dd" or "HH:mm"
  const format = parts
    .map(part => {
      switch (part.type) {
        case 'year':
          return 'yyyy';
        case 'month':
          return 'MM';
        case 'day':
          return 'dd';
        case 'hour':
          return 'HH';
        case 'minute':
          return 'mm';
        case 'second':
          return 'ss';
        case 'literal':
          return part.value;
        default:
          return '';
      }
    })
    .join('');

  return format;
}

export function parseDate(
  date: Date | string,
  format: string,
  i18n: i18nType,
  type: 'php' | 'standard'
): Date {
  if (date instanceof Date) {
    return date;
  }

  const commonFormats = type === 'php'
    ? { date: 'Y-m-d', datetime: 'Y-m-d H:i', datetime_s: 'Y-m-d H:i:s' }
    : { date: 'yyyy-mm-dd', datetime: 'yyyy-mm-dd hh:ii', datetime_s: 'yyyy-mm-dd hh:ii:ss' };

  let parsedFormat: { separators: string[]; parts: string[] };
  let useParsedTime: string[] | undefined;

  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(date)) {
    parsedFormat = formatHelper.parseFormat(commonFormats.date, type);
  } else if (/^\d{4}-\d{1,2}-\d{1,2}[T ]\d{1,2}:\d{1,2}$/.test(date)) {
    parsedFormat = formatHelper.parseFormat(commonFormats.datetime, type);
  } else if (/^\d{4}-\d{1,2}-\d{1,2}[T ]\d{1,2}:\d{1,2}:\d{1,2}[Z]{0,1}$/.test(date)) {
    parsedFormat = formatHelper.parseFormat(commonFormats.datetime_s, type);
  } else if (/^([01]*\d|2[0-3])([0-5]\d)(?:[ ]([ap][m]|[AP][M]))?$/.test(date)) {
    useParsedTime = date.match(/^([01]*\d|2[0-3])([0-5]\d)(?:[ ]([ap][m]|[AP][M]))?$/)?.slice(1).filter(Boolean);
    parsedFormat = formatHelper.parseFormat(format, type);
  } else {
    parsedFormat = formatHelper.parseFormat(format, type);
  }

  const parts = useParsedTime ?? date.toString().match(formatHelper.nonpunctuation) ?? [];
  date = new Date();
  date.setHours(0, 0, 0, 0);

  const parsed: Record<string, any> = {};
  const { setters_order, setters_map } = formatHelper.setters(type);

  if (parts.length !== parsedFormat.parts.length && parsedFormat.parts.includes('S')) {
    const index = parsedFormat.parts.indexOf('S') - 1;
    const splitSuffix = parts[index]?.match(/(\d+)([a-zA-Z]+)/)?.slice(1, 3);
    if (splitSuffix) {
      parts.splice(index, 1, ...splitSuffix);
    }
  }

  if (parts.length === parsedFormat.parts.length) {
    for (let i = 0; i < parsedFormat.parts.length; i++) {
      let val = parseInt(parts[i], 10);
      const part = parsedFormat.parts[i];

      if (isNaN(val)) {
        if (type === 'standard') {
          if (part === 'MM') val = i18n.months.indexOf(parts[i]) + 1;
          else if (part === 'M') val = i18n.monthsShort.indexOf(parts[i]) + 1;
          else if (part === 'p' || part === 'P') val = i18n.meridiem.indexOf(parts[i].toLowerCase());
        } else {
          if (part === 'D') val = i18n.daysShort.indexOf(parts[i]) + 1;
          else if (part === 'l') val = i18n.days.indexOf(parts[i]) + 1;
          else if (part === 'F') val = i18n.months.indexOf(parts[i]) + 1;
          else if (part === 'M') val = i18n.monthsShort.indexOf(parts[i]) + 1;
          else if (part === 'a' || part === 'A') val = i18n.meridiem.indexOf(parts[i].toLowerCase());
        }
      }

      parsed[part] = val;
    }

    for (const s of setters_order) {
      if (s in parsed && !isNaN(parsed[s])) {
        setters_map[s]?.(date, parsed[s]);
      }
    }
  }

  return date;
}
  
export function formatDate(
  date: Date | null,
  format: string,
  i18n: i18nType,
  type: 'php' | 'standard'
): string {
  if (date === null) {
    return '';
  }

  const dateVal = date.getDate();
  let val: Record<string, any>;

  if (type === 'standard') {
    val = {
      t: date.getTime(),
      yy: date.getFullYear().toString().substring(2),
      yyyy: date.getFullYear(),
      m: date.getMonth() + 1,
      M: i18n.monthsShort[date.getMonth()],
      MM: i18n.months[date.getMonth()],
      d: dateVal,
      D: i18n.daysShort[date.getDay()],
      DD: i18n.days[date.getDay()],
      p: i18n.meridiem.length === 2 ? i18n.meridiem[date.getHours() < 12 ? 0 : 1] : '',
      h: date.getHours(),
      ii: (date.getMinutes() < 10 ? '0' : '') + date.getMinutes(),
      ss: (date.getUTCSeconds() < 10 ? '0' : '') + date.getUTCSeconds(),
    };

    val.H = i18n.meridiem.length === 2 ? (val.h % 12 === 0 ? 12 : val.h % 12) : val.h;
    val.HH = (val.H < 10 ? '0' : '') + val.H;
    val.P = val.p.toUpperCase();
    val.hh = (val.h < 10 ? '0' : '') + val.h;
    val.i = val.ii;
    val.s = val.ss;
    val.dd = (val.d < 10 ? '0' : '') + val.d;
    val.mm = (val.m < 10 ? '0' : '') + val.m;
  } else if (type === 'php') {
    val = {
      y: date.getFullYear().toString().substring(2),
      Y: date.getFullYear(),
      F: i18n.months[date.getMonth()],
      M: i18n.monthsShort[date.getMonth()],
      n: date.getMonth() + 1,
      t: getDaysInMonth(date.getFullYear(), date.getMonth()),
      j: date.getDate(),
      l: i18n.days[date.getDay()],
      D: i18n.daysShort[date.getDay()],
      w: date.getDay(),
      N: date.getDay() === 0 ? 7 : date.getDay(),
      a: i18n.meridiem.length === 2 ? i18n.meridiem[date.getHours() < 12 ? 0 : 1] : '',
      g: date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
      G: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      U: Math.floor(date.getTime() / 1000),
    };

    val.m = (val.n < 10 ? '0' : '') + val.n;
    val.d = (val.j < 10 ? '0' : '') + val.j;
    val.A = val.a.toUpperCase();
    val.h = (val.g < 10 ? '0' : '') + val.g;
    val.H = (val.G < 10 ? '0' : '') + val.G;
    val.i = (val.i < 10 ? '0' : '') + val.i;
    val.s = (val.s < 10 ? '0' : '') + val.s;
  } else {
    throw new Error('Invalid format type.');
  }

  const dateArr: string[] = [];
  const pFormat = formatHelper.parseFormat(format, type);

  for (let i = 0, cnt = pFormat.parts?.length || 0; i < cnt; i++) {
    if (pFormat.separators.length) {
      dateArr.push(pFormat.separators.shift()!);
    }
    dateArr.push(val[pFormat.parts[i]]);
  }

  if (pFormat.separators.length) {
    dateArr.push(pFormat.separators.shift()!);
  }

  return dateArr.join('');
}

export function getDaysInMonth(year: number, month: number): number {
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  return [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
}

export function isLower(a: Date | string, b: Date): boolean {
  if (!(a instanceof Date)) return false;
  return (
    a.getFullYear() < b.getFullYear() ||
    a.getMonth() < b.getMonth() ||
    a.getDate() < b.getDate()
  );
}

export function isGreater(a: Date | string, b: Date): boolean {
  if (!(a instanceof Date)) return false;
  return (
    a.getFullYear() > b.getFullYear() ||
    a.getMonth() > b.getMonth() ||
    a.getDate() > b.getDate()
  );
}

type SettersConfig = {
  setters_order: string[];
  setters_map: SetterMap;
};
  
const formatHelper = {
  validParts(type: string): RegExp {
    if (type === 'standard') {
      return /t|hh?|HH?|p|P|z|ii?|ss?|dd?|DD?|S|mm?|MM?|yy(?:yy)?/g;
    } else if (type === 'php') {
      return /[dDjlNwzFmMnStyYaABgGhHisU]/g;
    } else {
      throw new Error('Invalid format type.');
    }
  },

  nonpunctuation: /[^ -\/:-@\[-`{-~\t\n\rTZ]+/g,

  parseFormat(format: string, type: string): ParsedFormat {
    const validPartsRegex = this.validParts(type);
    const separators = format.replace(validPartsRegex, '\0').split('\0');
    const parts = format.match(validPartsRegex) || [];
    
    if (!separators.length || !parts.length) {
      console.warn('Invalid date format', separators, parts);
    }
    return { separators, parts };
  },

  setters(type: string): SettersConfig {
    let setters_order: string[];
    let setters_map: SetterMap = {};

    if (type === 'standard') {
      setters_order = ['yyyy', 'yy', 'm', 'mm', 'M', 'MM', 'd', 'dd', 'D', 'DD', 'hh', 'h', 'HH', 'H', 'ii', 'i', 'ss', 's', 'S', 'p', 'P', 't'];
      setters_map = {
        hh: (d, v) => d.setHours(v),
        h: (d, v) => d.setHours(v),
        HH: (d, v) => d.setHours(v === 12 ? 0 : v),
        H: (d, v) => d.setHours(v === 12 ? 0 : v),
        i: (d, v) => d.setMinutes(v),
        s: (d, v) => d.setSeconds(v),
        yyyy: (d, v) => d.setFullYear(v),
        yy: (d, v) => d.setFullYear((v < 50 ? 2000 : 1900) + v),
        m: (d, v) => {
          v = (v - 1 + 12) % 12;
          d.setMonth(v);
          while (d.getMonth() !== v) d.setDate(d.getDate() - 1);
        },
        d: (d, v) => d.setDate(v),
        p: (d, v) => d.setHours(v === 1 && d.getHours() < 12 ? d.getHours() + 12 : d.getHours()),
        t: (d, v) => d.setTime(v)
      };
      ['mm', 'M', 'MM'].forEach(k => (setters_map[k] = setters_map.m));
      ['ii'].forEach(k => (setters_map[k] = setters_map.i));
      ['ss'].forEach(k => (setters_map[k] = setters_map.s));
      ['dd', 'D', 'DD'].forEach(k => (setters_map[k] = setters_map.d));
      ['P'].forEach(k => (setters_map[k] = setters_map.p));
    } else {
      setters_order = ['Y', 'yy', 'm', 'M', 'F', 'n', 'd', 'D', 'j', 'l', 'N', 'S', 'H', 'G', 'h', 'g', 'i', 's', 'p', 'P', 'U'];
      setters_map = {
        H: (d, v) => d.setHours(v),
        G: (d, v) => d.setHours(v),
        h: (d, v) => d.setHours(v === 12 ? 0 : v),
        g: (d, v) => d.setHours(v === 12 ? 0 : v),
        i: (d, v) => d.setMinutes(v),
        s: (d, v) => d.setSeconds(v),
        Y: (d, v) => d.setFullYear(v),
        yy: (d, v) => d.setFullYear((v < 50 ? 2000 : 1900) + v),
        m: (d, v) => {
          v = (v - 1 + 12) % 12;
          d.setMonth(v);
          while (d.getMonth() !== v) d.setDate(d.getDate() - 1);
        },
        n: (d, v) => d.setMonth(v - 1),
        d: (d, v) => d.setDate(v),
        a: (d, v) => d.setHours(v === 1 ? d.getHours() + 12 : d.getHours()),
        U: (d, v) => d.setTime(v * 1000)
      };
      ['F', 'M', 'm'].forEach(k => (setters_map[k] = setters_map.m));
      ['D', 'j', 'l', 'N', 'd'].forEach(k => (setters_map[k] = setters_map.d));
      ['A'].forEach(k => (setters_map[k] = setters_map.a));
    }
    return { setters_order, setters_map };
  }
};

export function getLocalizedData(locale = navigator.language || 'en-US') {
  const result = {
    days: [],
    daysShort: [],
    daysMin: [],
    months: [] ,
    monthsShort: [], 
    meridiem: [],
  } as i18nType;

  const date = new Date(2021, 0, 3); // Sample date for weekday (Sunday)

  // Loop through 7 days for the week
  for (let i = 0; i < 7; i++) {
    date.setDate(i + 3); // Adjust date to get different days
    result.days.push(new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date));
    result.daysShort.push(new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date));
    result.daysMin.push(new Intl.DateTimeFormat(locale, { weekday: 'narrow' }).format(date));
  }

  // Loop through 12 months for the year
  for (let i = 0; i < 12; i++) {
    date.setMonth(i); // Adjust month to get different months
    result.months.push(new Intl.DateTimeFormat(locale, { month: 'long' }).format(date));
    result.monthsShort.push(new Intl.DateTimeFormat(locale, { month: 'short' }).format(date));
  }

  result.days.push(result.days[0]);
  result.daysShort.push(result.daysShort[0]);
  result.daysMin.push(result.daysMin[0]);
  result.months.push(result.months[0])
  result.monthsShort.push(result.monthsShort[0])

  // Extract AM/PM meridiem names
  const timeFormatter = new Intl.DateTimeFormat(locale, { hour: 'numeric', hour12: true });
  const dateAM = new Date(2021, 0, 1, 9, 0); // 9:00 AM
  const datePM = new Date(2021, 0, 1, 21, 0); // 9:00 PM
  
  const formattedTimeAM = timeFormatter.format(dateAM);
  const formattedTimePM = timeFormatter.format(datePM);

  const meridiemAM = formattedTimeAM.includes('AM') ? 'AM' : null;
  const meridiemPM = formattedTimePM.includes('PM') ? 'PM' : null;

  result.meridiem = [meridiemAM, meridiemPM].filter(Boolean); // Return AM/PM in an array, removing any nulls

  return result;
  }
  