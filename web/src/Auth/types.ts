import UserRole from './Constants/UserRole'

export type UserSimple = {
    id: string
    name: string
    role: UserRole
    score: {
        rank: number
        time: {
            value: number
            rank: number
        }
        totalStars: {
            value: number
            rank: number
        }
        totalPlanets: {
            value: number
            rank: number
        }
    }

    personal: {
        isMale: boolean
        birth: number
        country: string
    }
}

export type Identity = UserSimple & {
    token: string
}