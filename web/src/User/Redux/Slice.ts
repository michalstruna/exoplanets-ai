import Cookies from 'js-cookie'

import { Cookie } from '../../Native'
import { Cursor, Redux, Sort, Value } from '../../Data'
import UserRole from '../Constants/UserRole'
import {
    Credentials,
    EditedUser,
    ExternalCredentials,
    Identity,
    Message,
    OnlineUser,
    RegistrationCredentials,
    User
} from '../types'
import { Requests, Socket } from '../../Async'
import { SegmentData } from '../../Database/types'
import { Action } from '../../Data/Utils/Redux'

const handleLogin = (state: any, action: Action<Identity>) => {
    state.identity.payload = action.payload
    Cookies.set(Cookie.IDENTITY.name, action.payload, { expires: Cookie.IDENTITY.expiration })
    Socket.emit('web_auth', action.payload._id)
}

const Slice = Redux.slice(
    'user',
    {
        users: Redux.async<User>(),
        identity: Redux.async<Identity>(Cookies.getJSON(Cookie.IDENTITY.name)),
        onlineUsers: Redux.empty<OnlineUser[]>([]),
        editedUser: Redux.async<EditedUser>(),
        userRank: Redux.async<Value<number>>(),
        messages: Redux.empty<Message[]>([])
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
            Socket.emit('web_unauth')
        }),
        edit: async<[string, FormData | EditedUser], User>('editedUser', ([userId, user]) => Requests.put(`users/${userId}`, user), {
            onSuccess: (state, action) => {
                const identity: Identity = { ...state.identity.payload!, ...action.payload }
                state.identity.payload = identity
                Cookies.set(Cookie.IDENTITY.name, identity, { expires: Cookie.IDENTITY.expiration })
            }
        }),
        getUserRank: async<[string, Sort[]], Value<number>>('userRank', ([userId, sort]) => {
            if (!userId) {
                return Promise.resolve({ value: 0 })
            }

            return Requests.get(`users/${userId}/rank`, undefined, { sort })
        }),

        setOnlineUsers: set<OnlineUser[]>('onlineUsers'),
        addOnlineUser: plain<OnlineUser>((state, action) => {
            state.onlineUsers.push(action.payload)
        }),
        removeOnlineUser: plain<string>((state, action) => {
            state.onlineUsers = state.onlineUsers.filter(user => user._id !== action.payload)
        }),
        updateOnlineUser: plain<[string, OnlineUser]>((state, action) => {
            state.onlineUsers = state.onlineUsers.map(user => user._id === action.payload[0] ? { ...user, ...action.payload[1] } : user)
        }),
        setMessages: set<Message[]>('messages'),
        addMessage: plain<Message>((state, action) => {
            state.messages.push(action.payload) // TODO:  slice(-50)
        })
    })
)

export default Slice.reducer

export const {
    getUsers, signUp, login, logout, facebookLogin, edit, getUserRank,
    setOnlineUsers, addOnlineUser, removeOnlineUser, updateOnlineUser,
    setMessages, addMessage
} = Slice.actions