import Language from './Constants/Language'

export type AsyncData<TData, TError = string | number | Error> = {
    isSent?: boolean
    payload?: TData
    error?: TError
}

export type ContentState = {
    strings: any
    language: Language
}