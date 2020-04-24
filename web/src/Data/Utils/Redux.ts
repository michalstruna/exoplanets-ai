import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const async = <T>(payload: T | null = null) => ({ pending: false, payload, error: null })

type Options<State, Payload> = {
    onPending?: (state: State, action: Action<Payload>) => any
    onSuccess?: (state: State, action: Action<Payload>) => any
    onError?: (state: State, action: Action<Payload>) => any
}

export type Action<Payload = void, Error = { message: string }> = {
    payload: Payload
    type: string
    error?: Error
}

enum ActionType {
    PLAIN,
    ASYNC,
    URL,
    SET
}


type AsyncAction<Payload> = (payload: Payload) => Promise<any>

type PlainAction<State, Payload> = (state: State, payload: Action<Payload>) => any
type ActionWrapper<State, Payload = any> = { type: ActionType, action: PlainAction<State, Payload> | AsyncAction<Payload>, property?: keyof State, options?: Options<State, Payload> }
type PlainActionWrapper<State, Payload> = { type: ActionType, action: PlainAction<State, Payload> }
type AsyncActionWrapper<State, Payload> = { type: ActionType, action: AsyncAction<Payload>, property: keyof State, options?: any }

type ActionsSet<State> = {
    plain: <Payload>(action: PlainAction<State, Payload>) => PlainActionWrapper<State, Payload>,
    async: <Payload>(property: keyof State, action: AsyncAction<Payload>, options?: any) => AsyncActionWrapper<State, Payload>,
    set: <Payload>(property: keyof State) => PlainActionWrapper<State, Payload>
}

export const slice = <State extends Record<any, any>, Actions extends Record<string, ActionWrapper<State>>>(name: string, initialState: State, actionsAccessor: (actions: ActionsSet<State>) => Actions) => {
    const reducers = {} as any
    const extraReducers = {} as any
    const extraActions = {} as any

    const actions = actionsAccessor({
        plain: action => ({ type: ActionType.PLAIN, action }),
        async: (property, action, options) => ({
            type: ActionType.ASYNC, property, action, options
        }),
        set: <Payload>(property: keyof State) => ({
            type: ActionType.SET, property, action: (state, action) => state[property] = action.payload as any
        })
    })

    for (const [key, value] of Object.entries(actions)) {
        if (value.type === ActionType.PLAIN) {
            reducers[key] = <T>(state: State, action: Action<T>) => {
                value.action(state, action as any)
            }
        } else if (value.type === ActionType.ASYNC) {
            const thunk = createAsyncThunk(name + '/' + key, value.action as AsyncAction<any>)

            extraActions[key] = thunk

            extraReducers[thunk.pending.type] = (state: any, action: any) => {
                state[value.property].pending = true

                if (value.options && value.options.onPending) {
                    value.options.onPending(state, action)
                } else {
                    state[value.property].payload = null
                    state[value.property].error = null
                }
            }

            extraReducers[thunk.fulfilled.type] = (state: any, action: any) => {
                state[value.property].pending = false
                state[value.property].error = null

                if (value.options && value.options.onSuccess) {
                    value.options.onSuccess(state, action)
                } else {
                    state[value.property].payload = action.payload
                }
            }

            extraReducers[thunk.rejected.type] = (state: any, action: any) => {
                state[value.property].pending = false
                state[value.property].error = action.error.message

                if (value.options && value.options.onError) {
                    value.options.onError(state, action)
                }
            }

        } else if (value.type === ActionType.URL) {

        } else if (value.type === ActionType.SET) {
            reducers[key] = <T>(state: State, action: Action<T>) => {
                value.action(state, action)
            }
        }
    }

    const slice = createSlice({ name, initialState, reducers, extraReducers })

    type OutputActions = {
        [T in keyof Actions]: Actions[T] extends AsyncActionWrapper<State, infer Payload> ?
            (payload: Payload) => any :
            Actions[T] extends { type: any, action: (state: State, action: Action<infer Payload>) => void, property?: any, options?: any } ?
                (payload: Payload) => any :
                never
    }

    return {
        actions: { ...slice.actions, ...extraActions } as OutputActions,
        reducer: slice.reducer
    }
}