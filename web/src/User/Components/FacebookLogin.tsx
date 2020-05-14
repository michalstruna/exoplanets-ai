import * as React from 'react'
import Styled from 'styled-components'

// @ts-ignore
import Facebook from 'react-facebook-login/dist/facebook-login-render-props'

import ExternalAuthButton from './ExternalAuthButton'
import { Color } from '../../Style'

interface Props extends React.ComponentPropsWithoutRef<'button'> {

}

const Root = Styled(ExternalAuthButton)`
    background-color: ${Color.FACEBOOK};
    
    &:hover {
        background-color: ${Color.FACEBOOK_HOVER};
    }
`

const FacebookLogin = ({ ...props }: Props) => {

    // TODO: Connect with app.

    return (
        <Facebook
            appId=''
            autoLoad
            callback={() => null}
            render={(renderProps: any) => (
                <Root {...renderProps} {...props} text='Facebook' icon='User/Facebook.svg' />
            )} />

    )

}

export default FacebookLogin