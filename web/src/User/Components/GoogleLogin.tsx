import * as React from 'react'
import Styled from 'styled-components'
import Google, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login'

import ExternalAuthButton from './ExternalAuthButton'
import { Color } from '../../Style'
import { googleLogin } from '..'
import { Config } from '../../Async'
import { useActions } from '../../Data'

interface Props extends React.ComponentPropsWithoutRef<'button'> {}

const Root = Styled(ExternalAuthButton)`
    background-color: ${Color.GOOGLE};
    color: ${Color.GOOGLE_FOREGROUND};
    
    &:hover {
        background-color: ${Color.GOOGLE_HOVER};
    }
`
const GoogleLogin = ({ ...props }: Props) => {
    const actions = useActions({ googleLogin })

    const handleSuccess = (res: GoogleLoginResponse | GoogleLoginResponseOffline) => {
        if ('accessToken' in res) {
            actions.googleLogin({ token: res.accessToken })
        }
    }

    const handleFail = (x: any) => {

    }

    return (
        <Google
            clientId={Config.googleId}
            buttonText="Google"
            onSuccess={handleSuccess}
            onFailure={handleFail}
            cookiePolicy={'single_host_origin'}
            render={libProps => <Root {...libProps} {...props} text="Google" icon="User/Google.svg" />}
        />
    )
}

export default GoogleLogin
