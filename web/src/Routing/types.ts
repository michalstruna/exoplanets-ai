export type QuerySet = any

export interface Location {
    hash: string
    pathname: string
    search: string
}

export interface Target {
    hash?: string
    pathname?: string
    query?: QuerySet
}

export interface LinkData extends Target {
    text?: string
}