import React from 'react'
import Styled from 'styled-components'

interface Static {

}

interface Props extends React.ComponentPropsWithoutRef<'nav'> {

}

const Root = Styled.nav`

`

const Nav: React.FC<Props> & Static = ({ ...props }) => {

    return (
        <Root {...props}>

        </Root>
    )

}

export default Nav