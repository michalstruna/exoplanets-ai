import { createReducer } from '@reduxjs/toolkit'

import * as Actions from './Actions'
import { ContentState } from '../types'
import String from '../Constants/String'
import Languages from '../Utils/Languages'
import Redux from '../Utils/Redux'

const defaultLanguage = Languages.getDefault()
const defaultStrings = Languages.localize(String, defaultLanguage)

export default createReducer<ContentState>(
    {
        strings: defaultStrings,
        language: defaultLanguage
    },
    {
        [Actions.setLanguage.toString()]: (state, action) => {
            state.language = action.payload
            state.strings = Languages.localize(String, action.payload)
        }
    }
)