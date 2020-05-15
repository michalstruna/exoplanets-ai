import * as Validator from './Validator'

/**
 * Find index of last item that match predicate.
 * @param items Array of any items.
 * @param predicate Predicate that accepts value from array and current index in parameters and returns if item match predicate.
 * @return Index of last item in array that match predicate.
 */
export const findLastIndex = <T>(items: T[], predicate: Validator.BiPredicate<T, number>): number => {
    for (let i = items.length - 1; i >= 0; i--) {
        if (Validator.is2(items[i], i, predicate)) {
            return i
        }
    }

    return -1
}

export const equals = <T>(array1: T[], array2: T[]): boolean => {
    return !!array1 && !!array2 && !(array1 < array2 || array2 < array1)
}

export const range = (from: number, to: number, step: number = 1): number[] => {
    const result = []

    const realStep = (from > to && step > 0) || (from < to && step < 0) ? -step : step
    const getCondition = (i: number) => from <= to ? i <= to : i >= to

    for (let i = from; getCondition(i); i += realStep) {
        result.push(i)
    }

    return result
}