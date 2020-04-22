import { combineReducers, configureStore, getDefaultMiddleware, Store } from '@reduxjs/toolkit'

import { Reducer as AuthReducer } from '../../Auth'
import { Reducer as ContentReducer, Redux } from '../../Data'
import { Reducer as DatabaseReducer, setBodiesSort, setBodiesSegment } from '../../Database'
import { Query, Urls } from '../../Routing'

const RootReducer = combineReducers({
    auth: AuthReducer,
    content: ContentReducer,
    universe: DatabaseReducer
})

const syncWithUrl = (store: Store) => (next: any) => <T>(action: Redux.Action<any>) => {
    const { type, payload } = action

    switch (type) {
        case setBodiesSort.toString():
            Urls.replace({
                query: {
                    [Query.SORT_COLUMN]: payload.column,
                    [Query.SORT_IS_ASC]: +payload.isAsc,
                    [Query.SORT_LEVEL]: payload.level
                }
            })
            break
        case setBodiesSegment.toString():
            Urls.replace({
                query: {
                    [Query.SEGMENT_START]: payload.index,
                    [Query.SEGMENT_SIZE]: payload.size
                }
            })

            break
    }

    return next(action)
}

export default configureStore<typeof RootReducer>({
    reducer: RootReducer,
    middleware: [...getDefaultMiddleware(), syncWithUrl] as any
})