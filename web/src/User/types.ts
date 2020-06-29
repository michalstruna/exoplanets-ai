import UserRole from './Constants/UserRole'

export type UserSimple = {
    _id: string
    name: string
    avatar?: string,
    role: UserRole
    score: {
        rank: number
        time: number
        stars: number
        planets: number
    }
    personal: {
        isMale: boolean
        birth: number
        country: string
    }
    activity: {
        isOnline: boolean,
        last: number,
        devices: {
            count: number,
            power: number
        }
    }
}

export type Identity = UserSimple & {
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