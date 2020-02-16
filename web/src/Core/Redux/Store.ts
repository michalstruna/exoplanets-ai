import { configureStore } from '@reduxjs/toolkit'

import { ContentState, ContentReducer } from '../../Content'
import { AuthReducer, AuthState } from '../../Auth'

type State = {
    auth: AuthState
    content: ContentState
}

export default configureStore<State>({
    reducer: {
        auth: AuthReducer,
        content: ContentReducer
    }
})