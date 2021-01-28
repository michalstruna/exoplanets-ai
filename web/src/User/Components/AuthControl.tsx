import React from 'react'

import { IconText } from '../../Layout'
import { useIdentity } from '../index'
import UserPreview from './UserPreview'
import AuthForm from './AuthForm'
import Tooltip from '../../Layout/Components/Tooltip'

interface Props {

}

const setCoords = () => ({ x: window.innerWidth - 70, y: 25 })

const AuthControl = ({  }: Props) => {

    const identity = useIdentity()
    const isLoggedIn = !!identity.payload

    return (
        <Tooltip id='login'
            render={() => isLoggedIn ? <UserPreview user={identity.payload} /> : <AuthForm />}
            setCoords={setCoords}>
            <IconText
                icon='User/User.svg'
                text={isLoggedIn ? identity.payload.name : 'Přihlášení'}
                onClick={() => null} />
        </Tooltip>
    )

}

export default AuthControl