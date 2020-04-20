import * as React from 'react'
import Styled from 'styled-components'
import Google from 'react-google-login'

import ExternalAuthButton from './ExternalAuthButton'
import { Color } from '../../Style'

interface Props extends React.ComponentPropsWithoutRef<'button'> {

}

const Root = Styled(ExternalAuthButton)`
    background-color: ${Color.GOOGLE};
    color: ${Color.GOOGLE_FOREGROUND};
    
    &:hover {
        background-color: ${Color.GOOGLE_HOVER};
    }
`

const FacebookLogin: React.FC<Props> = ({ ...props }) => {

    const handleSuccess = () => {

    }

    const handleFail = () => {

    }

    // TODO: Data to config?

    return (
        <Google
            clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
            buttonText="Google"
            onSuccess={handleSuccess}
            onFailure={handleFail}
            cookiePolicy={'single_host_origin'}
            render={() => (
                <Root {...props} text='Google' icon='Auth/Google.svg' />
            )}
        />
    )

}

export default FacebookLogin