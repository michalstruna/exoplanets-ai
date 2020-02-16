import { configureStore } from '@reduxjs/toolkit'

import { ContentState, ContentReducer } from '../../Content'

type State = {
    content: ContentState
}

export default configureStore<State>({
    reducer: {
        content: ContentReducer
    }
})