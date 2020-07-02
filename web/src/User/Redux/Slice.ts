import Cookies from 'js-cookie'

import { Cookie } from '../../Native'
import { Redux } from '../../Data'
import UserRole from '../Constants/UserRole'
import { Credentials, ExternalCredentials, Identity, UserSimple } from '../types'
import { Requests } from '../../Async'

const demoIdentity: Identity = {
    _id: 'abc',
    token: 'def',
    name: 'Michal Struna',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Google_Earth_icon.svg/1200px-Google_Earth_icon.svg.png',
    role: UserRole.ADMIN,
    score: {
        rank: 193,
        planets: 216,
        stars: 512,
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

const onlineUsers = [] as UserSimple[]

for (let i = 0; i < 38; i++) {
    onlineUsers.push({
        _id: 'abc' + i,
        avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Google_Earth_icon.svg/200px-Google_Earth_icon.svg.png',
        name: ('Michal Struna ' + i).repeat(Math.floor(Math.random() * 2 + 1)),
        role: UserRole.AUTHENTICATED,
        score: {
            rank: 193,
            planets: 213,
            stars: 512,
            time: 337
        },
        personal: {
            country: 'CZ',
            birth: 456,
            isMale: true
        },
        activity: {
            isOnline: true,
            last: new Date().getTime(),
            devices: {
                count: 3,
                power: 456781
            }
        }
    })
}

const Slice = Redux.slice(
    'user',
    {
        identity: Redux.async<Identity>(Cookies.getJSON(Cookie.IDENTITY.name)),
        onlineUsers: Redux.async<UserSimple[]>(onlineUsers)
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
        facebookLogin: async<ExternalCredentials, Identity>('identity', credentials => Requests.post(`users/login/facebook`, credentials), {
                onSuccess: (state, action) => {
                    state.identity.payload = action.payload
                    Cookies.set(Cookie.IDENTITY.name, action.payload, { expires: Cookie.IDENTITY.expiration })
                }
            }
        ),
        logout: plain<void>(state => {
            state.identity.payload = null
            Cookies.remove(Cookie.IDENTITY.name)
        })
    })
)

export default Slice.reducer
export const { login, logout, facebookLogin } = Slice.actions