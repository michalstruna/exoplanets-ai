import EmailValidator from 'email-validator'
import UrlValidator from 'is-valid-http-url'

module Validator {

    type FunctionPredicate<T> = (value: T) => boolean
    type BiFunctionPredicate<T1, T2> = (value1: T1, value2: T2) => boolean
    type ValuePredicate<T> = T
    type ArrayPredicate<T> = T[]
    type RegExpPredicate = RegExp
    export type Predicate<T> = FunctionPredicate<T> | ValuePredicate<T> | ArrayPredicate<T> | RegExpPredicate
    export type BiPredicate<T1, T2> = (value1: T1, value2: T2) => boolean

    export enum Relation {
        EQUALS,
        CONTAINS,
        LESS_THAN,
        MORE_THAN,
        STARTS_WITH,
        ENDS_WITH
    }

    export const isEmail = (text: string): boolean => (
        EmailValidator.validate(text)
    )

    export const isUrl = (text: string): boolean => (
        UrlValidator(text)
    )

    export const is = <T>(value: T, predicate: Predicate<T>) => {
        if (predicate instanceof RegExp) {
            return predicate.test(value.toString())
        } else if (Array.isArray(predicate)) {
            return predicate.includes(value)
        } else if (typeof predicate === 'function') {
            return (predicate as Function)(value)
        } else {
            return value === predicate
        }
    }

    export const is2 = <T1, T2>(value1: T1, value2: T2, predicate: BiPredicate<T1, T2>) => {
        if (predicate instanceof RegExp) {
            return predicate.test(value1.toString()) && predicate.test(value2.toString())
        } else if (typeof predicate === 'function') {
            return (predicate as Function)(value1, value2)
        } else {
            return value1 === predicate && value2 === predicate
        }
    }

    export const compare = <T>(value: T, relation: Relation, value2: T) => {
        // TODO
    }

    export const safe = <T>(value: T, predicate: Predicate<T>, defaultValue: T) => {
        return is(value, predicate) ? value : defaultValue
    }

}

export default Validator