import UserRole from './Constants/UserRole'

export type UserSimple = {
    id: string
    name: string
    avatar?: string,
    role: UserRole
    score: {
        rank: number
        time: number
        totalStars: number
        totalPlanets: number
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