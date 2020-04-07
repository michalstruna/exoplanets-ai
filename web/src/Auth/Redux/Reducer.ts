import { createReducer } from '@reduxjs/toolkit'

import { Redux } from '../../Utils'
import UserRole from '../Constants/UserRole'
import { Identity } from '../types'

const demoIdentity: Identity = {
    id: 'abc',
    token: 'def',
    name: 'Michal Struna',
    role: UserRole.ADMIN,
    score: {
        rank: 193,
        totalPlanets: { value: 3, rank: 216 },
        totalStars: { value: 314, rank: 512 },
        time: { value: 7875, rank: 337 }
    },
    personal: {
        country: 'CZ',
        birth: 456,
        isMale: true
    }
}


export default createReducer(
    {
        identity: Redux.async(demoIdentity)
    },
    {}
)