import * as React from 'react'
import Styled from 'styled-components'

import { Duration, Mixins } from '../../Style'

interface Props extends React.ComponentPropsWithoutRef<'button'> {
    text: string
    icon: string
}

const Root = Styled.button.attrs({
    type: 'button'
})<any>`
    ${Mixins.Size('auto', '2.5rem')}
    ${({ icon }) => Mixins.Image(icon, 'auto 1.5rem', '0.5rem center')}
    box-sizing: border-box;
    font-size: 90%;
    font-weight: bold;
    text-align: left;
    padding-left: 2.7rem;
    transition: background-color ${Duration.FAST};
`

const ExternalAuthButton: React.FC<Props> = ({ text, ...props }) => {

    return (
        <Root {...props}>
            {text}
        </Root>
    )

}

export default ExternalAuthButton