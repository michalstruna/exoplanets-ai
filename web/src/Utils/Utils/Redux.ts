import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export const async = <T>(payload: T = null) => ({ pending: false, payload, error: null })

type Case<State> = (state: State, action: PayloadAction<any>) => any
type AsyncCase<State> = [keyof State, any]

export const reducer = <State extends Record<string, any>, Actions extends Record<string, Case<State> | AsyncCase<State>>>(name: string, initialState: State, actions: Actions) => {

    const reducers = {}
    const extraReducers = {}
    const extraActions = {}

    for (const [key, value] of Object.entries(actions)) {
        if (Array.isArray(value)) {
            const [field, func] = value
            const action = createAsyncThunk(name + '/' + key, func as any)

            extraActions[key] = action

            extraReducers[action.pending.type] = state => {
                state[field].pending = true
            }

            extraReducers[action.fulfilled.type] = (state, action) => {
                state[field].pending = false
                state[field].payload = action.payload
                state[field].error = null
            }

            extraReducers[action.rejected.type] = (state, action) => {
                state[field].pending = false
                state[field].error = action.payload
            }

        } else {
            reducers[key] = (state, action) => {
                value(state, action)
            }
        }
    }

    const slice = createSlice({ name, initialState, reducers, extraReducers })

    return {
        actions: { ...slice.actions, ...extraActions } as { [T in keyof Actions]: Actions[T] extends [string, infer Func] ? Func : Actions[T] extends (state: State, action: PayloadAction<infer P>) => any ? (payload: P) => any : never },
        reducer: slice.reducer
    }

}