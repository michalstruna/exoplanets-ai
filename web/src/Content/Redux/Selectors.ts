import { useSelector } from 'react-redux'

// TODO: Importing of store state will cause circular dependency.
export const useStrings = (): any => useSelector<any>(({ content }) => content.strings)

export const useLanguage = (): any => useSelector<any>(({ content }) => content.language)