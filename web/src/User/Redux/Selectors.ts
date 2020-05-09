import { useSelector } from 'react-redux'
import { AsyncData } from '../../Data'
import { UserSimple } from '../types'

export const useIdentity = (): any => useSelector<any>(state => state.user.identity)

export const useOnlineUsers = () => useSelector<any>(state => state.user.onlineUsers) as AsyncData<UserSimple[]>