import Validator from './Validator'

module Arrays {

    export const findLastIndex = <T>(items: T[], predicate: Validator.BiPredicate<T, number>) => {
        for (let i = items.length - 1; i >= 0; i--) {
            if (Validator.is2(items[i], i, predicate)) {
                return i
            }
        }

        return -1
    }

}

export default Arrays