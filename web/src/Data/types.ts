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

export type EnumTextValue<TValue = any> = TextValue & {
    values?: TextValue<TValue>[]
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