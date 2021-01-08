import Cookies from 'js-cookie'

import { Cookie } from '../../Native'
import { Cursor, Redux } from '../../Data'
import UserRole from '../Constants/UserRole'
import { Credentials, ExternalCredentials, Identity, User } from '../types'
import { Requests } from '../../Async'
import { SegmentData } from '../../Database/types'

const demoIdentity: Identity = {
    _id: 'abc',
    token: 'def',
    name: 'Michal Struna',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Google_Earth_icon.svg/1200px-Google_Earth_icon.svg.png',
    role: UserRole.ADMIN,
    stats: {
        planets: { value: 0, diff: 0 },
        items: { value: 0, diff: 0 },
        time: { value: 0, diff: 0 },
        data: { value: 0, diff: 0 }
    },
    personal: {
        country: 'CZ',
        birth: 456,
        sex: true
    },
    created: new Date().getTime(),
    modified: new Date().getTime(),
    online: true,
    devices: { count: 0, power: 0 }
}

const onlineUsers = [] as User[]

for (let i = 0; i < 38; i++) {
    onlineUsers.push({
        _id: 'abc' + i,
        avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Google_Earth_icon.svg/200px-Google_Earth_icon.svg.png',
        name: ('Michal Struna ' + i).repeat(Math.floor(Math.random() * 2 + 1)),
        role: UserRole.AUTHENTICATED,
        stats: {
            planets: { value: 0, diff: 0 },
            items: { value: 0, diff: 0 },
            time: { value: 0, diff: 0 },
            data: { value: 0, diff: 0 }
        },
        personal: {
            country: 'CZ',
            birth: 456,
            sex: true
        },
        created: new Date().getTime(),
        modified: new Date().getTime(),
        online: true,
        devices: { count: 3, power: 456781 }
    })
}

const Slice = Redux.slice(
    'user',
    {
        users: Redux.async<User>(),
        identity: Redux.async<Identity>(Cookies.getJSON(Cookie.IDENTITY.name)),
        onlineUsers: Redux.async<User[]>(onlineUsers)
    },
    ({ set, async, plain }) => ({
        getUsers: async<Cursor, SegmentData<User>>('users', cursor => Requests.get(`users`, undefined, cursor)),

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
export const { getUsers, login, logout, facebookLogin } = Slice.actions