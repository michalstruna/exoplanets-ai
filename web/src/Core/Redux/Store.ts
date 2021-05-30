import { configureStore } from '@reduxjs/toolkit'

import { Reducer as UserReducer } from '../../User'
import { Reducer as ContentReducer } from '../../Data'
import { Reducer as DatabaseReducer } from '../../Database'
import { Reducer as LayoutReducer } from '../../Layout'
import { Reducer as DiscoveryReducer } from '../../Discovery'

const store = configureStore({
    reducer: {
        user: UserReducer,
        content: ContentReducer,
        database: DatabaseReducer,
        layout: LayoutReducer,
        discovery: DiscoveryReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store