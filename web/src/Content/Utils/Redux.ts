import { createAction } from '@reduxjs/toolkit'

module Redux {

    export enum AsyncSuffix {
        STARTED = '/started',
        SUCCEEDED = '/succeeded',
        FAILED = '/failed'
    }

    export const createAsyncAction = <T extends any>(type: string, request: () => Promise<T>) => {
        const started = createAction(type + AsyncSuffix.STARTED)
        const succeeded = createAction<any>(type + AsyncSuffix.SUCCEEDED) // TODO: <T>
        const failed = createAction<Error>(type + AsyncSuffix.FAILED)

        const action = () => dispatch => {
            dispatch(started())

            request()
                .then(result => {
                    dispatch(succeeded(result))
                    return result
                })
                .catch(error => {
                    dispatch(failed(error))
                    return error
                })
        }

        action.toString = () => type

        return action
    }

    export const processAsyncAction = (type: string, key: string) => ({
        [type + AsyncSuffix.STARTED]: (state, action) => {
            return {
                ...state,
                [key]: {
                    ...state[key],
                    isSent: true
                }
            }
        },
        [type + AsyncSuffix.SUCCEEDED]: (state, action) => {
            return {
                ...state,
                [key]: {
                    ...state[key],
                    payload: action.payload,
                    isSent: false
                }
            }
        },
        [type + AsyncSuffix.FAILED]: (state, action) => {
            state[key].isSent = false
            state[key].error = action.payload
        }
    })

    export const getAsyncData = (data: any = null) => ({
        isSent: true,
        payload: data,
        error: null
    })

}

export default Redux