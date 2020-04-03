import * as React from 'react'
import { useDispatch } from 'react-redux'

import Loader from './Loader'
import { AsyncData } from '../../Content'

export interface Static<T> {

}

export interface Props<T> {
    data: AsyncDataAction<T> | AsyncDataAction<T>[]
    pending?: () => React.ReactNode
    success?: () => React.ReactNode
    fail?: () => React.ReactNode
}

export type Type<T> = React.FC<Props<T>> & Static<T>

type AsyncDataAction<TPayload, TError = string> = {
    0: AsyncData<TPayload, TError> // Storage in store.
    1?: () => void // Action.
    2?: any[] // Array of updaters.
}

const Async: Type<any> = <T extends any>({ data: rawData, pending, success, fail }) => {
    const isSingle = !Array.isArray(rawData) || (('payload' in rawData[0]) && typeof rawData[1] === 'function')
    const data = (isSingle ? [rawData] : rawData).map(item => Array.isArray(item) ? item : [item])
    const dispatch = useDispatch()

    const findError = (items: AsyncDataAction<T>[]) => {
        const itemError = items.find(item => item[0].error)
        return itemError ? itemError[0].error : null
    }

    const getState = () => ({
        isPending: !!data.find(item => item[0].pending),
        error: findError(data),
        hasPayloads: !data.find(item => !item[0].payload)
    })

    for (const item of data) {
        React.useEffect(() => {
            if (item[1] && (!item[0].payload || item[2])) {
                dispatch(item[1]())
            }
        }, item[2] || [])
    }

    const { isPending, error, hasPayloads } = getState()

    if (error) {
        return fail ? fail() : error.toString()
    } else if (hasPayloads) {
        return success ? success() : null
    } else if (isPending) {
        return pending ? pending() : <Loader />
    }

    return null
}

export default Async