import Cookies from 'js-cookie'

import { Cookie } from '../../Native'
import { Redux } from '../../Data'
import UserRole from '../Constants/UserRole'
import { Credentials, Identity } from '../types'

const demoIdentity: Identity = {
    id: 'abc',
    token: 'def',
    name: 'Michal Struna',
    role: UserRole.ADMIN,
    score: {
        rank: 193,
        totalPlanets: 216,
        totalStars: 512,
        time: 337
    },
    personal: {
        country: 'CZ',
        birth: 456,
        isMale: true
    },
    activity: {
        devices: {
            count: 3,
            power: 2317
        },
        isOnline: true,
        last: new Date().getTime()
    }
}

const Slice = Redux.slice(
    'auth',
    {
        identity: Redux.async<Identity>(Cookies.getJSON(Cookie.IDENTITY.name))
    },
    ({ set, async, plain }) => ({
        login: async<Credentials, Identity>('identity', ({ email, password }) => new Promise((resolve, reject) => {
            // TODO: Cookies
            setTimeout(() => {
                if (email === 'm@m.cz' && password === '123') {
                    resolve(demoIdentity)
                    Cookies.set(Cookie.IDENTITY.name, demoIdentity, { expires: Cookie.IDENTITY.expiration })
                } else {
                    reject('Bad identity.')
                }
            }, 1000)
        })),
        logout: plain<void>(state => {
            state.identity.payload = null
            Cookies.remove(Cookie.IDENTITY.name)
        })
    })
)

export default Slice.reducer
export const { login, logout } = Slice.actions