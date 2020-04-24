import { combineReducers, configureStore } from '@reduxjs/toolkit'

import { Reducer as AuthReducer } from '../../Auth'
import { Reducer as ContentReducer } from '../../Data'
import { Reducer as DatabaseReducer } from '../../Database'

const RootReducer = combineReducers({
    auth: AuthReducer,
    content: ContentReducer,
    database: DatabaseReducer
})

const store = configureStore<typeof RootReducer>({ reducer: RootReducer })

export default store