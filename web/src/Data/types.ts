import { Validator } from '../Native'

export type AsyncData<TData, TError = string | number | Error> = {
    isSent?: boolean
    payload?: TData
    error?: TError
}

/**
 * Object pair with properties text and value.
 */
export type TextValue<TValue = any> = {
    text: string
    value: TValue
}

/**
 * Possible values can be:
 * - Type constructor (String, Number, Date),
 * - List of array pairs [text, value],
 * - List of array pairs [text, ArrayPair[]] where text is title of group and ArrayPair[] is list of [text, value].
 */
export type PossibleValues<TValue = any> = TextValue<TValue>[] | StringConstructor | NumberConstructor | DateConstructor

/**
 * Object pair with possible values.
 */
export type TextEnumValue<TValue = any> =  TextValue<TValue> & {
    values: PossibleValues<TValue>
}


export type FilterData<TValue = string | number> = {
    attribute: string[]
    relation: Validator.Relation[]
    value: TValue[]
}

export type Sort = {
    column: number
    columnName?: string
    isAsc: boolean
    level: number
}

export type Segment = {
    index: number
    size: number
}

export type Cursor = {
    filter: FilterData
    sort: Sort
    segment: Segment
}

export type Strings = any


export type LogObject = {
    created: number
    modified: number
}