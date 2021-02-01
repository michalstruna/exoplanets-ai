import UserRole from './Constants/UserRole'
import { StatsObject } from '../Stats'
import { LogObject } from '../Data'
import Sex from './Constants/Sex'
import { MessageTag } from '.'

export type UserPersonal = {
    sex?: Sex
    birth?: number
    country?: string
    contact?: string
    text?: string
}

export type User = LogObject & StatsObject & {
    _id: string
    name: string
    avatar?: string
    role: UserRole
    online?: boolean  // TODO: Remove?
    personal: UserPersonal
    devices: {
        count: number,
        power: number
    }
}

export type OnlineUser = User & {
    webs: string[]
    clients: string[]
}

export type EditedUser = {
    personal: UserPersonal
    avatar?: string | null
    old_password?: string
    password?: string
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

export type NewMessage = {
    text: string
}

export type Message = LogObject & NewMessage & {
    user?: User
    tag?: MessageTag
    created: number
}