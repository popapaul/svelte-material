export const MODE_DECADE = 0;
export const MODE_YEAR = 1;
export const MODE_MONTH = 2;

export const STARTVIEW_TIME = 3;

export type UpdateProp = {
    type: 'date' | 'datetime' | 'hour' | 'minute',
    date: Date,
    isKeyboard: boolean,
    dateIndex?: number
}

export type DateChange = {
    value: string|string[]|null,
    dateValue: Date|Date[]|null,
    displayValue: string,
    valueFormat: string,
    displayFormat: string | null,
    event: 'date'|'hour'|'minute'|'datetime'
}