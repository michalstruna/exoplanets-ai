import UserRole from './Constants/UserRole'
import { StatsObject } from '../Stats'
import { LogObject, UniqueObject } from '../Data'
import Sex from './Constants/Sex'
import { MessageTag } from '.'

export type UserPersonal = {
    sex?: Sex
    birth?: number
    country?: string
    contact?: string
    text?: string
}

export type User = UniqueObject & LogObject & StatsObject & {
    name: string
    avatar?: string
    role: UserRole
    online?: boolean
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
    username: string,
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

export type Message = UniqueObject & LogObject & NewMessage & {
    user?: User
    tag: MessageTag
    created: number
}