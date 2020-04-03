import { combineReducers, configureStore } from '@reduxjs/toolkit'

import { Reducer as AuthReducer } from '../../Auth'
import { Reducer as ContentReducer } from '../../Content'
import { Reducer as UniverseReducer } from '../../Universe'

const RootReducer = combineReducers({
    auth: AuthReducer,
    content: ContentReducer,
    universe: UniverseReducer
})

export default configureStore<typeof RootReducer>({
    reducer: RootReducer
})