import { Redux } from '..'
import { Requests } from '../../Async'

import String from '../Constants/String'
import { Strings } from '../types'
import * as Languages from '../Utils/Languages'

const defaultLanguage = Languages.getDefault()
const defaultStrings = Languages.localize(String, defaultLanguage)

const slice = Redux.slice(
    'content',
    {
        strings: defaultStrings,
        language: defaultLanguage,
        uploadedFile: Redux.async<string>()
    },
    ({ plain, async }) => ({
        setLanguage: plain<Strings>((state, action) => {
            state.language = action.payload
            state.strings = Languages.localize(String, action.payload)
        }),
        uploadFile: async<[File, string], string>('uploadedFile', ([file, type]) => {
            const formData = new FormData()
            formData.append('file', file)
            return Requests.post(`files/${type}`, formData)
        })
    })
)

export const { setLanguage, uploadFile } = slice.actions
export default slice.reducer