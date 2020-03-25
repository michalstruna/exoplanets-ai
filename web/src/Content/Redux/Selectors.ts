import { useSelector } from 'react-redux'
import { createSelector } from '@reduxjs/toolkit'

import Languages from '../Utils/Languages'

const selectStrings = state => state.content.strings
const selectLanguage = state => state.content.language

const selectLocalizedStrings = createSelector(
    [selectStrings, selectLanguage],
    (strings, language) => Languages.localize(strings, language)
)

export const useStrings = () => useSelector(selectLocalizedStrings)
export const useLanguage = () => useSelector(selectLanguage)