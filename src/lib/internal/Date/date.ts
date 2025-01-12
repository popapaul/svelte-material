interface DateObject {
	Y: number;
	M: number;
	D: number;
	H: number;
	A: number;
	h: number;
	m: number;
	s: number;
	S: number;
	_index: number;
	_length: number;
	_match: number;
}

type Token = 'YYYY' | 'YY' | 'MM' | 'M' | 'DD' | 'D';
let _formatter = {
	YYYY: (d: Date) => ('000' + d.getFullYear()).slice(-4),
	YY: (d: Date) => ('0' + d.getFullYear()).slice(-2),
	MM: (d: Date) => ('0' + (d.getMonth() + 1)).slice(-2),
	M: (d: Date) => '' + (d.getMonth() + 1),
	DD: (d: Date) => ('0' + d.getDate()).slice(-2),
	D: (d: Date) => '' + d.getDate()
};
let _parser = {
	YYYY: function (str: string) {
		return this.exec(/^\d{4}/, str);
	},
	YY: function (str: string) {
		var result = this.exec(/^\d\d/, str);
		result.value += result.value < 50 ? 2000 : 1900;
		return result;
	},
	MM: function (str: string) {
		return this.exec(/^\d\d/, str);
	},
	M: function (str: string) {
		return this.exec(/^\d\d?/, str);
	},
	DD: function (str: string) {
		return this.exec(/^\d\d/, str);
	},
	D: function (str: string) {
		return this.exec(/^\d\d?/, str);
	},
	exec: function (re: RegExp, str: string) {
		var result = (re.exec(str) || [''])[0];
		return { value: result as any | 0, length: result.length };
	}
};

function format(dateObj: Date, formatString: string, utc?: number) {
	if (isNaN(dateObj?.getTime())) return '';
	let d = addMinutes(dateObj, utc ? dateObj.getTimezoneOffset() : 0),
		formatter = _formatter;

	// eslint-disable-next-line no-useless-escape
	return formatString.replace(
		/\[[^\[\]]*]|\[.*\][^\[]*\]|([A-Za-z])\1*|./g,
		(substring: string) => {
			const token = substring as Token;
			return formatter[token] ? formatter[token](d) : token.replace(/\[(.*)]/, '$1');
		}
	);
}

function preparse(dateString: string, formatString: string) {
	let parser = _parser;
	let re = /([A-Za-z])\1*|./g;
	let keys;
	let token;
	let result;
	let offset = 0;
	let dt: DateObject = {
		Y: 0,
		M: 0,
		D: 0,
		H: 0,
		A: 0,
		h: 0,
		m: 0,
		s: 0,
		S: 0,
		_index: 0,
		_length: 0,
		_match: 0
	};

	while ((keys = re.exec(formatString))) {
		token = keys[0] as Token;
		if (parser[token]) {
			result = parser[token](dateString.slice(offset), formatString);
			if (!result.length) {
				break;
			}
			offset += result.length;
			dt[token.charAt(0)] = result.value;
			dt._match++;
		} else if (token === dateString.charAt(offset) || token === ' ') {
			offset++;
		} else {
			break;
		}
	}
	dt._index = offset;
	dt._length = dateString.length;
	return dt;
}

function isValid(arg: DateObject | string, formatString: string = '') {
	// arg - a date structure or a date string
	let dt = typeof arg === 'string' ? preparse(arg, formatString) : arg;
	let last = [31, 28 + Number(isLeapYear(dt.Y)), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][dt.M - 1];

	return !(
		dt._index < 1 ||
		dt._length < 1 ||
		dt._index - dt._length ||
		dt._match < 1 ||
		dt.Y < 1 ||
		dt.Y > 9999 ||
		dt.M < 1 ||
		dt.M > 12 ||
		dt.D < 1 ||
		dt.D > last
	);
}

function parse(dateString: string, formatString: string, utc?: boolean) {
	let dt = preparse(dateString, formatString);
	let dateObj;

	if (isValid(dt)) {
		dt.M -= dt.Y < 100 ? 22801 : 1; // 22801 = 1900 * 12 + 1
		if (utc) {
			dateObj = new Date(Date.UTC(dt.Y, dt.M, dt.D, dt.H, dt.m, dt.s, dt.S));
		} else {
			dateObj = new Date(dt.Y, dt.M, dt.D, dt.H, dt.m, dt.s, dt.S);
		}
		return dateObj;
	}
	return new Date();
}

function addMinutes(dateObj: Date, minutes: number) {
	return addMilliseconds(dateObj, minutes * 60000);
}

function addMilliseconds(dateObj: Date, milliseconds: number) {
	return new Date(dateObj.getTime() + milliseconds);
}

function isLeapYear(y: number) {
	return (!(y % 4) && !!(y % 100)) || !(y % 400);
}

function isSameDay(date1: Date, date2: Date) {
	return format(date1, 'YYYYMMDD') === format(date2, 'YYYYMMDD');
}

export function isEqual(d1:Date, d2:Date) {
    return d1 && d2 && d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
}


function isDate(value: Date) {
	return Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value?.getTime());
}
export { format, parse, isSameDay, isDate };
