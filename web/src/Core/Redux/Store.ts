import { combineReducers, configureStore } from '@reduxjs/toolkit'

import { Reducer as UserReducer } from '../../User'
import { Reducer as ContentReducer } from '../../Data'
import { Reducer as DatabaseReducer } from '../../Database'

const RootReducer = combineReducers({
    user: UserReducer,
    content: ContentReducer,
    database: DatabaseReducer
})

const store = configureStore<typeof RootReducer>({ reducer: RootReducer })

export default store