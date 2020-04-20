export type Filter = {

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