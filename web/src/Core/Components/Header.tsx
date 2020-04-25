import React from 'react'
import Styled from 'styled-components'

import Nav from './Nav'
import AuthControl from '../../User/Components/AuthControl'

interface Static {

}

interface Props extends React.ComponentPropsWithoutRef<'div'> {

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



const Header: React.FC<Props> & Static = ({ ...props }) => {

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