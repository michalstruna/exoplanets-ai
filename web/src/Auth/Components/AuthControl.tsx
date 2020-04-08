import React from 'react'

import Auth from './Auth'
import UserRole from '../Constants/UserRole'
import { Window } from '../../Layout'
import { IconButton } from '../../Control'
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
                <Window
                    renderButton={() => (
                        <IconButton icon='Auth/User.svg' isLarge={true}>
                            Přihlášení
                        </IconButton>
                    )}>
                    <LoginForm />
                </Window>
            )}
            otherwise={() => (
                <Window
                    renderButton={() => (
                        <IconButton icon='Auth/User.svg' isLarge={true}>
                            {identity.payload.name}
                        </IconButton>
                    )}>
                    <UserPreview user={identity.payload} />
                </Window>
            )} />
    )

}

export default AuthControl