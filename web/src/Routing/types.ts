export type QuerySet = Record<string, string | number | null | undefined | (string | number)[]>

export interface Location {
    hash: string
    pathname: string
    search: string
}

export interface Target extends Omit<Partial<Location>, 'search'> {
    query?: QuerySet
}

export interface LinkData extends Target {
    text?: string
}