import React from 'react'

import UserRole, { test } from '../Constants/UserRole'
import { useIdentity } from '..'

interface Props {
    role?: UserRole | UserRole[]
    noRole?: UserRole | UserRole[]
    when?: () => React.ReactNode
    otherwise?: () => React.ReactNode
    identityId?: string
}

const Auth = ({ role, noRole, when, otherwise, identityId }: Props) => {

    const identity = useIdentity()
    const isRoleOk = test(identity.payload, role, noRole)
    const isIdentityOk = typeof identityId === 'undefined' ? true : (identity.payload && identity.payload._id === identityId)

    return (
        <>
            {isRoleOk && isIdentityOk ? (when as any)() : (otherwise as any)()}
        </>
    )

}

Auth.defaultProps = {
    when: () => null,
    otherwise: () => null
}

export default Auth