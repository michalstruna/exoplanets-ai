import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const async = <T>(payload: T = null) => ({ pending: false, payload, error: null })

type Case<State> = (state: State, action: any) => any
type AsyncCase<State> = Record<keyof State, Case<State>>

export const reducer = <State extends Record<string, any>, Actions extends Record<string, Case<State> | AsyncCase<State>>>(name: string, initialState: State, actions: Actions) => {

    const reducers = {}
    const extraReducers = {}
    const extraActions = {}

    for (const [key, value] of Object.entries(actions)) {
        if (typeof value === 'object') {
            const field = Object.keys(value)[0]
            const action = createAsyncThunk(name + '/' + key, value[field])

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
            reducers[key] = value
        }
    }


    const slice = createSlice({ name, initialState, reducers, extraReducers })

    return {
        actions: { ...slice.actions, ...extraActions } as { [T in keyof Actions]: any },//  Record<keyof Actions, any>,
        reducer: slice.reducer
    }

}