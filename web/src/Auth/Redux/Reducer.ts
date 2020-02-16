import { createReducer } from '@reduxjs/toolkit'

import * as Actions from './Actions'
import { AuthState } from '../types'
import { Redux } from '../../Content'


export default createReducer<AuthState>(
    {
        identity: null
    },
    {}
)