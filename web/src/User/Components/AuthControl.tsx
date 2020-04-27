import React from 'react'

import Auth from './Auth'
import UserRole from '../Constants/UserRole'
import { Window, IconText } from '../../Layout'
import { LoginForm, useIdentity } from '../index'
import UserPreview from './UserPreview'

interface Static {

}

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

const AuthControl: React.FC<Props> & Static = ({ ...props }) => {

    const identity = useIdentity()

    return (
        <Auth
            role={UserRole.UNAUTHENTICATED}
            when={() => (
                <Window renderButton={() => <IconText icon='User/User.svg' text='Přihlášení' onClick={() => null} />}>
                    <LoginForm />
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