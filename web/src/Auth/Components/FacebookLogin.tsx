import * as React from 'react'
import Styled from 'styled-components'
import Facebook from 'react-facebook-login'

import ExternalAuthButton from './ExternalAuthButton'
import { Color } from '../../Utils'

interface Props extends React.ComponentPropsWithoutRef<'button'> {

}

const Root = Styled(ExternalAuthButton)`
    background-color: ${Color.FACEBOOK};
    
    &:hover {
        background-color: ${Color.FACEBOOK_HOVER};
    }
`

const FacebookLogin: React.FC<Props> = ({ ...props }) => {

    // TODO: Connect with app.

    return (
        <Facebook
            appId=''
            autoLoad
            callback={() => null} />
    )

}

export default FacebookLogin