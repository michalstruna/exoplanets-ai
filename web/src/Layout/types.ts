import { Validator } from '../Native'
import React from 'react'

export type Filter<TValue = string | number> = {
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
    filter: Filter
    sort: Sort
    segment: Segment
}

export type TooltipData = {
    render: () => React.ReactNode
    coords: {
        x: number
        y: number
    }
}

export interface Column<TItem, TValue> {
    title: React.ReactNode
    accessor: (item: TItem, index: number) => TValue
    render?: (value: TValue, item: TItem, index: number) => React.ReactNode
    icon?: string
    headerIcon?: string
    width?: number | string
    interactive?: boolean // TODO: Remove?
    name?: string
}

export type Level = {
    columns: Column<any, any>[] // TODO: Remove any.
    accessor?: (item: any) => any[]
}