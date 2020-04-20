import { QuerySet } from '../types'
import Query from '../Constants/Query'

/**
 * Set new parameter to query string.
 * @param source Source query string.
 * @param name Name of parameter.
 * @param value Value of parameter.
 * @returns Query string with new parameter.
 */
export const set = (source: string, name: Query, value: Query): string => {
    const params = new URLSearchParams(source)

    if (value === null) {
        params.delete(name)
    } else {
        params.set(name, value)
    }

    return params.toString()
}

/**
 * Get parameter from query string.
 * @param source Source query string.
 * @param name Name of parameter.
 * @returns Value of parameter.
 */
export const get = (source: string, name: Query): Query => {
    return new URLSearchParams(source).get(name) as Query
}

/**
 * CHeck if parameter is in query string.
 * @param source Source query string.
 * @param name Name of parameter.
 * @returns Parameter is in query string.
 */
export const has = (source: string, name: Query): boolean => {
    return new URLSearchParams(source).has(name)
}

/**
 * Delete parameter from query string.
 * @param source Source query string.
 * @param name Name of parameter.
 */
export const remove = (source: string, name: Query): void => {
    new URLSearchParams(source).delete(name)
}

/**
 * Merge changes to source query string.
 * @param source Source query string.
 * @param changes Query object changes.
 * @returns Merged query string.
 */
export const merge = (source: string, changes: QuerySet): string => {
    const params = new URLSearchParams(source)

    for (const i in changes) {
        if (changes[i] === null) {
            params.delete(i)
        } else if (Array.isArray(changes[i])) {
            params.delete(i)

            for (const value of changes[i]) {
                params.append(i, value)
            }
        } else {
            params.set(i, changes[i])
        }
    }

    return params.toString()
}

/**
 * Convert query string to query object.
 * @param source Source query string.
 * @returns Query object.
 */
export const parse = (source: string): QuerySet => {
    const result = {} as any

    new URLSearchParams(source).forEach((value: string, key: string) => {
        result[key] = value
    })

    return result
}

/**
 * Convert query object to query string.
 * @param source Source query object.
 * @returns Query string.
 */
export const toString = (source: QuerySet): string => {
    return new URLSearchParams(source).toString()
}

/**
 * Check if target refers to the same query as source.
 * @param source Source query string.
 * @param target Target query object.
 */
export const isCurrent = (source: string, target: QuerySet): boolean => {
    if (typeof source === 'string') {
        const sourceQuery = new URLSearchParams(source)
        const targetQuery = new URLSearchParams(target)

        if (sourceQuery.toString() !== targetQuery.toString()) {
            return false
        }
    } else {
        for (const i in target) {
            if (target[i] !== source[i]) {
                return false
            }
        }
    }

    return true
}

export { default as Query } from '../Constants/Query'