import React from 'react'

import UserRole from '../Constants/UserRole'
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
    const isRoleOk = UserRole.test(identity.payload, role, noRole)
    const isIdentityOk = typeof identityId === 'undefined' ? true : (identity.payload && identity.payload.id === identityId)

    return (
        <>
            {isRoleOk && isIdentityOk ? when() : otherwise()}
        </>
    )

}

Auth.defaultProps = {
    when: () => null,
    otherwise: () => null
}

export default Auth