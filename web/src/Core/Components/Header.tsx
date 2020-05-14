import React from 'react'
import Styled from 'styled-components'

import Nav from './Nav'
import AuthControl from '../../User/Components/AuthControl'
import { Dimension } from '../../Style'

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

const Root = Styled.div`
    height: ${Dimension.NAV_HEIGHT};
`

const Left = Styled.div`
    height: 100%;
    float: left;
`

const Right = Styled(Left)`
    float: right;
    padding-right: 1.5rem;
`



const Header = ({ ...props }: Props) => {

    return (
        <Root {...props}>
            <Left>
                <Nav />
            </Left>
            <Right>
                <AuthControl />
            </Right>
        </Root>
    )

}

export default Header