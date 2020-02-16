import React from 'react'
import Styled from 'styled-components'

interface Static {

}

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    left?: React.ReactElement
    right?: React.ReactElement
}

const Root = Styled.div`
    overflow: hidden;
`

const Left = Styled.div`
    float: left;
`

const Right = Styled(Left)`
    float: right;
`

const Header: React.FC<Props> & Static = ({ left, right, ...props }) => {

    return (
        <Root {...props}>
            <Left>
                {left}
            </Left>
            <Right>
                {right}
            </Right>
        </Root>
    )

}

export default Header