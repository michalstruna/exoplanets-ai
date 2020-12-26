import { Validator } from '../Native'

export type AsyncData<TData, TError = string | number | Error> = {
    isSent?: boolean
    payload?: TData
    error?: TError
}

export type TextValue<TValue = any> = {
    text: string
    value: TValue
}

export type EnumTextValues<TValue = any> = TextValue<TValue>[] | StringConstructor | NumberConstructor | DateConstructor

export type EnumTextValue<TValue = any> = TextValue<TValue> & {
    values: EnumTextValues<TValue>
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

export type UniqueObject = {
    _id: string
}