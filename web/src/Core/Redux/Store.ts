import { combineReducers, configureStore } from '@reduxjs/toolkit'

import { Reducer as AuthReducer } from '../../Auth'
import { Reducer as ContentReducer } from '../../Data'
import { Reducer as DatabaseModule } from '../../Database'

const RootReducer = combineReducers({
    auth: AuthReducer,
    content: ContentReducer,
    universe: DatabaseModule
})

export default configureStore<typeof RootReducer>({
    reducer: RootReducer
})