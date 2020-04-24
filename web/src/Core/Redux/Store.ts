import { combineReducers, configureStore } from '@reduxjs/toolkit'

import { Reducer as AuthReducer } from '../../Auth'
import { Reducer as ContentReducer, Redux } from '../../Data'
import { Reducer as DatabaseReducer } from '../../Database'
import { Query, Urls } from '../../Routing'
import { Validator } from '../../Native'

const RootReducer = combineReducers({
    auth: AuthReducer,
    content: ContentReducer,
    database: DatabaseReducer.reducer
})
/*
type SyncUrl = [keyof typeof RootReducer, (state: any) => any, Query, Validator.Predicate<any>, any][]
const syncUrl = [...DatabaseReducer.syncUrl] as SyncUrl*/

const store = configureStore<typeof RootReducer>({ reducer: RootReducer })
/*
let lastState = store.getState()

store.subscribe(() => {
    const state = store.getState()
    const changes: Record<string, any> = {}

    for (const [reducerName, accessor, queryName, predicate, defaultValue] of syncUrl) {
        const value = accessor(state[reducerName])

        if (value !== accessor(lastState[reducerName])) {
            changes[queryName] = Validator.safe(value, predicate, defaultValue)
        }
    }

    if (Object.keys(changes).length > 0) {
        lastState = state
        Urls.replace({ query: changes })
    }
})*/

export default store