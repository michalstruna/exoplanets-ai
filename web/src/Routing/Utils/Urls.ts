import Path from 'path'
import QueryString from 'query-string'

import History from '../Redux/History'
import { Target, Location } from '../types'
import * as Queries from './Queries'
import { Validator } from '../../Native'

/**
 * Push new URL to browser history.
 * @param location Target location.
 */
export const push = (location: Target): void => {
    History.push(merge(location))
}

/**
 * Replace last URL by new URL in browser history.
 * @param location Target location.
 */
export const replace = (location: Target): void => {
    History.replace(merge(location))
}

/**
 * Merge target location to source location.
 * @param target Target location.
 * @param source Source location. (optional, default current location)
 * @return Merged location.
 */
export const merge = (target: Target, source: Location = History.location): Location => { // TODO
    const result: Location = {} as any

    if (target.pathname || source.pathname) {
        const pathname = target.pathname || source.pathname
        result.pathname = Array.isArray(pathname) ? Path.join(...pathname) : pathname
    }

    if (target.query || source.search) {
        result.search = Queries.merge(source.search, target.query!)
    }

    if (target.hash) {
        result.hash = target.hash
    }

    return result
}

/**
 * Check pathname from URL. If its current value is not allowed, set default value.
 */
export const safePathname = (predicate: Validator.Predicate<string>, defaultValue: string): void => {
    const value = History.location.pathname

    if (!Validator.is(value, predicate)) {
        replace({ pathname: defaultValue })
    }
}

/**
 * Check query parameter from URL. If its value is not allowed, set default value.
 */
export const safeQuery = (queryName: string, predicate: Validator.Predicate<string | string[] | null | undefined>, defaultValue: string): void => {
    const value = QueryString.parse(History.location.search)[queryName]

    if (!Validator.is(value, predicate)) {
        replace({ query: { [queryName]: defaultValue } })
    }
}

/**
 * Check hash from URL. If its current value is not allowed, set default value.
 */
export const safeHash = (predicate: Validator.Predicate<string>, defaultValue: string): void => {
    const value = History.location.hash

    if (!Validator.is(value, predicate)) {
        replace({ hash: defaultValue })
    }
}

/**
 * Check if target refers to the same URL as source.
 */
export const isCurrent = (source: Location, target: Target): boolean => {
    if (target.pathname && source.pathname !== target.pathname) {
        return false
    }

    if (target.query && !Queries.isCurrent(source.search, target.query)) {
        return false
    }

    if (target.hash && source.hash.replace('#', '') !== target.hash) {
        return false
    }

    return true
}

export { default as Url } from '../Constants/Url'
export { default as Query } from '../Constants/Query'
export { default as Hash } from '../Constants/Hash'