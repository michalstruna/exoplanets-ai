import { useSelector } from 'react-redux'
import { AsyncData, Segment } from '../../Data'
import { User } from '../types'
import { SegmentData } from '../../Database/types'

export const useIdentity = (): any => useSelector<any>(state => state.user.identity)

export const useUsers = () => useSelector<any>(state => state.user.users) as AsyncData<SegmentData<User>>

export const useOnlineUsers = () => useSelector<any>(state => state.user.onlineUsers) as User[]