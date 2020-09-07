import * as Validator from './Validator'

/**
 * Find index of last item that match predicate.
 */
export const findLastIndex = <T>(items: T[], predicate: Validator.BiPredicate<T, number>): number => {
    for (let i = items.length - 1; i >= 0; i--) {
        if (Validator.is2(items[i], i, predicate)) {
            return i
        }
    }

    return -1
}

/**
 * Check if teo arrays contains same items in same order (without deep equality).
 */
export const equals = <T>(array1: T[], array2: T[]): boolean => {
    return !!array1 && !!array2 && !(array1 < array2 || array2 < array1)
}

/**
 * Create number sequence from-to (includes) with step between numbers (default = 1).
 */
export const range = (from: number, to: number, step: number = 1): number[] => {
    const result = []

    const realStep = (from > to && step > 0) || (from < to && step < 0) ? -step : step
    const getCondition = (i: number) => from <= to ? i <= to : i >= to

    for (let i = from; getCondition(i); i += realStep) {
        result.push(i)
    }

    return result
}

type UpdateItem<T> = T | ((item: T, i: number) => T)

export const update = <T>(array: T[], condition: Validator.BiPredicate<T, number>, update: UpdateItem<T>) => {
    for (const i in array) {
        if (Validator.is2(array[i], parseInt(i), condition)) {
            if (update instanceof Function) {
                array[i] = update(array[i], parseInt(i))
            } else {
                array[i] = update
            }
        }
    }
}

export const getNthExtreme = (arr: number[], extreme: Math['max'] | Math['min'], nth: number): number => {
    let tmp = [...arr]

    for (let i = 0; i < nth - 1; i++) {
        const val = extreme(...tmp)
        tmp.splice(tmp.indexOf(val), 1)
    }

    return extreme(...tmp)
}