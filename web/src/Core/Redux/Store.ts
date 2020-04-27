import { combineReducers, configureStore } from '@reduxjs/toolkit'

import { Reducer as UserReducer } from '../../User'
import { Reducer as ContentReducer } from '../../Data'
import { Reducer as DatabaseReducer } from '../../Database'
import { Reducer as LayoutReducer } from '../../Layout'

const RootReducer = combineReducers({
    user: UserReducer,
    content: ContentReducer,
    database: DatabaseReducer,
    layout: LayoutReducer
})

const store = configureStore<typeof RootReducer>({ reducer: RootReducer })

export default store