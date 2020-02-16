import { createAction } from '@reduxjs/toolkit'

import Language from '../Constants/Language'
import Redux from '../Utils/Redux'

export const setLanguage = createAction<Language>('content/set_language')