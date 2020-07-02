import React from 'react'

import Auth from './Auth'
import UserRole from '../Constants/UserRole'
import { Window, IconText } from '../../Layout'
import { useIdentity } from '../index'
import UserPreview from './UserPreview'
import AuthForm from './AuthForm'

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

const AuthControl = ({ ...props }: Props) => {

    const identity = useIdentity()

    return (
        <Auth
            role={UserRole.UNAUTHENTICATED}
            when={() => (
                <Window renderButton={() => <IconText icon='User/User.svg' text='Přihlášení' onClick={() => null} />}>
                    <AuthForm />
                </Window>
            )}
            otherwise={() => (
                <Window renderButton={() => <IconText
                    icon='User/User.svg'
                    text={identity.payload.name}
                    onClick={() => null} />}>
                    <UserPreview user={identity.payload} />
                </Window>
            )} />
    )

}

export default AuthControl