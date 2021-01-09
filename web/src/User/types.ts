import UserRole from './Constants/UserRole'
import { StatsObject } from '../Stats'
import { LogObject } from '../Data'

export type User = LogObject & StatsObject & {
    _id: string
    name: string
    avatar?: string,
    role: UserRole
    online?: boolean  // TODO: Remove?
    personal: {
        sex?: boolean
        birth?: number
        country?: string
        contact?: string
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

export type RegistrationCredentials = Credentials & {
    name: string
}

export type ForgotPasswordData = {
    email: string
}

export type ExternalCredentials = {
    token: string
}