import React from 'react'
import Styled from 'styled-components'

import Nav from './Nav'
import { Window } from '../../Layout'
import { LoginForm } from '../../Auth'
import { Dimensions, Mixin } from '../../Utils'

interface Static {

}

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

interface ControlProps {
    icon: string
}

const Root = Styled.div`

`

const Left = Styled.div`
    float: left;
`

const Right = Styled(Left)`
    float: right;
    padding-right: 1.5rem;
`

const Control = Styled.button<ControlProps>`
    ${props => Mixin.Image(props.icon, 'auto 1.2rem', 'left center')}
    ${Mixin.Size('auto', Dimensions.NAV_HEIGHT, true)}
    ${Mixin.OpacityHover()}
    padding-left: 2rem;
`

const Header: React.FC<Props> & Static = ({ ...props }) => {

    return (
        <Root {...props}>
            <Left>
                <Nav />
            </Left>
            <Right>
                <Window
                    renderButton={() => (
                        <Control icon='Auth/User.svg'>
                            Přihlášení
                        </Control>
                    )}>
                    <LoginForm />
                </Window>
            </Right>
        </Root>
    )

}

export default Header