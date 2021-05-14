import * as React from 'react'
import Styled from 'styled-components'

// @ts-ignore
import Facebook from 'react-facebook-login/dist/facebook-login-render-props'

import ExternalAuthButton from './ExternalAuthButton'
import { Color } from '../../Style'
import { useActions } from '../../Data'
import { facebookLogin } from '..'
import { Config } from '../../Async'

interface Props extends React.ComponentPropsWithoutRef<'button'> {}

const Root = Styled(ExternalAuthButton)`
    background-color: ${Color.FACEBOOK};
    
    &:hover {
        background-color: ${Color.FACEBOOK_HOVER};
    }
`

const FacebookLogin = ({ ...props }: Props) => {
    const actions = useActions({ facebookLogin })

    return (
        <Facebook
            appId={Config.fbId}
            callback={(identity: any) => actions.facebookLogin({ token: identity.accessToken })}
            scope="user_birthday,user_gender,user_location"
            render={(renderProps: any) => <Root {...renderProps} {...props} text="Facebook" icon="User/Facebook.svg" />}
        />
    )
}

export default FacebookLogin
