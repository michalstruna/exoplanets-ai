import Cookies from 'js-cookie'

import { Cookie } from '../../Native'
import { Cursor, Redux } from '../../Data'
import UserRole from '../Constants/UserRole'
import { Credentials, ExternalCredentials, Identity, RegistrationCredentials, User } from '../types'
import { Requests } from '../../Async'
import { SegmentData } from '../../Database/types'
import { Action } from '../../Data/Utils/Redux'

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

const handleLogin = (state: any, action: Action<Identity>) => {
    state.identity.payload = action.payload
    Cookies.set(Cookie.IDENTITY.name, action.payload, { expires: Cookie.IDENTITY.expiration })
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
        login: async<Credentials, Identity>('identity', credentials => Requests.post(`users/login`, credentials), {
            onSuccess: handleLogin
        }),
        signUp: async<RegistrationCredentials, Identity>('identity', credentials => Requests.post(`users/sign-up`, credentials), {
            onSuccess: handleLogin
        }),
        facebookLogin: async<ExternalCredentials, Identity>('identity', credentials => Requests.post(`users/login/facebook`, credentials), {
            onSuccess: handleLogin
        }),
        logout: plain<void>(state => {
            state.identity.payload = null
            Cookies.remove(Cookie.IDENTITY.name)
        })
    })
)

export default Slice.reducer
export const { getUsers, signUp, login, logout, facebookLogin } = Slice.actions