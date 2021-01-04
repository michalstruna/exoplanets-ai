import UserRole from './Constants/UserRole'
import { AggregatedStats } from '../Stats'

export type User = {
    _id: string
    name: string
    avatar?: string,
    role: UserRole
    stats: AggregatedStats
    created: number
    modified: number
    online?: boolean  // TODO: Remove?
    personal: {
        male?: boolean
        birth?: number
        country?: string
        text?: string
    }
    devices: {
        count: number,
        power: number
    }
}

export type Identity = User & {
    token: string
}

export type Credentials = {
    email: string,
    password: string
}

export type RegistrationData = Credentials & {
    name: string
}

export type ForgotPasswordData = {
    email: string
}

export type ExternalCredentials = {
    token: string
}