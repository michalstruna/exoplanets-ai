import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const async = <T>(payload: T | null = null) => ({ pending: false, payload, error: null })

type Options<State, Payload> = {
    onPending?: (state: State, action: Action<Payload>) => any
    onSuccess?: (state: State, action: Action<Payload>) => any
    onError?: (state: State, action: Action<Payload>) => any
}

export type Action<Payload = void, Error = { message: string }> = {
    payload?: Payload
    type: string
    error?: Error
}

type Case<State> = (state: State, action: Action<any>) => any

type Reducer<State, Actions> = {
    [Key in keyof Actions]: Actions[Key] extends [any, (payload: infer Payload) => any, any?] ? [keyof State, any, Options<State, any>?] : Case<State>
}

export const reducer = <State extends Record<string, any>, Actions extends Reducer<State, any>>(name: string, initialState: State, actions: Actions) => {

    const reducers = {} as any
    const extraReducers = {} as any
    const extraActions = {} as any

    for (const [key, value] of Object.entries(actions)) {
        if (Array.isArray(value)) {
            const [field, func, options] = value
            const action = createAsyncThunk(name + '/' + key, func as any)

            extraActions[key] = action

            extraReducers[action.pending.type] = (state: any, action: any) => {
                state[field].pending = true

                if (options && options.onPending) {
                    options.onPending(state, action)
                } else {
                    state[field].payload = null
                    state[field].error = null
                }
            }

            extraReducers[action.fulfilled.type] = (state: any, action: any) => {
                state[field].pending = false
                state[field].error = null

                if (options && options.onSuccess) {
                    options.onSuccess(state, action)
                } else {
                    state[field].payload = action.payload
                }
            }

            extraReducers[action.rejected.type] = (state: any, action: any) => {
                state[field].pending = false
                state[field].error = action.error.message

                if (options && options.onError) {
                    options.onError(state, action)
                }
            }

        } else {
            reducers[key] = (state: any, action: any) => {
                (value as Function)(state, action)
            }
        }
    }

    const slice = createSlice({ name, initialState, reducers, extraReducers })

    return {
        actions: { ...slice.actions, ...extraActions } as { [T in keyof Actions]: Actions[T] extends [string, (payload: infer Payload) => any, any?] ? (p: Payload) => Action : Actions[T] extends (state: State, action: Action<infer P>) => any ? (payload?: P) => any : never },
        reducer: slice.reducer
    }

}