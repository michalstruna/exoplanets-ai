import { Validator } from '../Native'

export type Filter<TValue = string | number> = {
    attribute: string[]
    relation: Validator.Relation[]
    value: TValue[]
}

export type Sort = {
    column: number
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