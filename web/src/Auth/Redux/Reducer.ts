import { Redux } from '../../Utils'
import UserRole from '../Constants/UserRole'
import { Credentials, Identity } from '../types'

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


const Reducer = Redux.reducer(
    'auth',
    {
        identity: Redux.async()
    },
    {
        login: ['identity', ({ email, password }: Credentials) => new Promise((resolve, reject) => {
            // TODO: Cookies
            setTimeout(() => {
                if (email === 'm@m.cz' && password === '123') {
                    resolve(demoIdentity)
                } else {
                    reject('Bad identity.')
                }
            }, 1000)
        })],

        logout: state => state.identity.payload = null

    }
)

export default Reducer.reducer
export const { login, logout } = Reducer.actions