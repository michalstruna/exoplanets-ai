import Language from './Constants/Language'

export type AsyncData<T> = {
    isSent?: boolean
    payload?: T
    error?: any
}

export type ContentState = {
    strings: any
    language: Language
}