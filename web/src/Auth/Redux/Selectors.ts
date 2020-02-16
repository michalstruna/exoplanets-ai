import { useSelector } from 'react-redux'

export const useIdentity = (): any => useSelector<any>(({ auth }) => auth.identity)