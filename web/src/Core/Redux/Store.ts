import { combineReducers, configureStore } from '@reduxjs/toolkit'

import { Reducer as UserReducer } from '../../User'
import { Reducer as ContentReducer } from '../../Data'
import { Reducer as DatabaseReducer } from '../../Database'
import { Reducer as LayoutReducer } from '../../Layout'
import { Reducer as DiscoveryReducer } from '../../Discovery'

const RootReducer = combineReducers({
    user: UserReducer,
    content: ContentReducer,
    database: DatabaseReducer,
    layout: LayoutReducer,
    discovery: DiscoveryReducer
})

const store = configureStore<typeof RootReducer>({ reducer: RootReducer })

export default store