import * as React from 'react'
import Styled from 'styled-components'
import Google from 'react-google-login'

import ExternalAuthButton from './ExternalAuthButton'
import { Color } from '../../Style'
import { Config } from '../../Async'

interface Props extends React.ComponentPropsWithoutRef<'button'> {

}

const Root = Styled(ExternalAuthButton)`
    background-color: ${Color.GOOGLE};
    color: ${Color.GOOGLE_FOREGROUND};
    
    &:hover {
        background-color: ${Color.GOOGLE_HOVER};
    }
`

const FacebookLogin = ({ ...props }: Props) => {

    const handleSuccess = () => {
        // TODO
    }

    const handleFail = () => {

    }

    return (
        <Google
            clientId={Config.googleId}
            buttonText="Google"
            onSuccess={handleSuccess}
            onFailure={handleFail}
            cookiePolicy={'single_host_origin'}
            render={() => (
                <Root {...props} text='Google' icon='User/Google.svg' />
            )}
        />
    )

}

export default FacebookLogin