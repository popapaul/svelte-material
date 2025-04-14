export type ConditionalBoolean<T, D extends boolean = false> = D extends true ? T[] : T;
export type test = {
    'data-test'?: string;}