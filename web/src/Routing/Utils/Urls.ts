import Path from 'path'

import History from '../Redux/History'
import { Target, Location } from '../types'
import Query from '../Constants/Query'
import Hash from '../Constants/Hash'
import * as Queries from './Queries'

type Validator<T> = (value: T) => boolean

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
 * Parse pathname, query and hash of location.
 * @param location String location.
 * @returns Parsed location.
 */
export const parse = (location: string): Location => { // TODO
    return null as any
}

/**
 * Convert location to string.
 * @param location Source location.
 * @returns String location.
 */
export const toString = (location: Location): string => {
    let result = location.pathname

    if (location.search) {
        result += '?' + location.search
    }

    if (location.hash) {
        result += '#' + location.hash
    }

    return result.replace(/#{2,}/, '#').replace(/\?{2,}/, '?')
}

/**
 * Merge target location to source location.
 * @param target Target location.
 * @param source Source location. (optional, default current location)
 * @return Merged location.
 */
export const merge = (target: Target, source: Location = History.location): Location => { // TODO
    const result: Location = {} as any // TODO

    if (target.pathname || source.pathname) {
        const pathname = target.pathname || source.pathname
        result.pathname = Array.isArray(pathname) ? Path.join(...pathname) : pathname
    }

    if (target.query || source.search) {
        result.search = Queries.merge(source.search, target.query)
    }

    if (target.hash) {
        result.hash = target.hash
    }

    return result
}

export const testHash = (validator: Validator<Hash>, defaultValue: Hash): void => { // TODO

}

export const testPath = (paramName: string, validator: Validator<string>, defaultValue: string): void => { // TODO

}

/**
 * Check query parameter from URL. If not exists or not have allowed value, set default value.
 * @param queryName Name of query parameter.
 * @param validator Validator.
 * @param defaultValue Default value if current value is not allowed.
 */
export const testQuery = (queryName: Query, validator: Validator<Query>, defaultValue: Query): void => {
    const value = Queries.get(History.location.search, queryName)

    if (!validator(value)) {
        replace({ query: { [queryName]: defaultValue } })
    }
}

/**
 * Check if target refers to the same URL as source.
 * @param source Source location.
 * @param target Target location.
 * @returns Target refers to the same URL as source.
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