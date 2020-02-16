import Query from './Constants/Query'

// TODO: [name: Query] error.
/*export interface QuerySet {
    [name: string]: Query
}*/

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

/**
 * Sometimes you need a lot of links with value of one query parameter.
 * It's not necessary write query={{ [Query.NAME]: Query.VALUE }}, just: queryValue={Query.VALUE}.
 */
export interface PartialLinkData extends LinkData {
    queryValue?: string
}