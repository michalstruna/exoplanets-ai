import React from 'react'

import UserRole, { test } from '../Constants/UserRole'
import { useIdentity } from '..'

interface Static {

}

interface Props {
    role?: UserRole | UserRole[]
    noRole?: UserRole | UserRole[]
    when?: () => React.ReactNode
    otherwise?: () => React.ReactNode
    identityId?: string
}

const Auth: React.FC<Props> & Static = ({ role, noRole, when, otherwise, identityId }) => {

    const identity = useIdentity()
    const isRoleOk = test(identity.payload, role, noRole)
    const isIdentityOk = typeof identityId === 'undefined' ? true : (identity.payload && identity.payload.id === identityId)

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