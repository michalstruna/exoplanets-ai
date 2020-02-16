import React from 'react'
import Styled from 'styled-components'

interface Static {

}

interface Props {

}

const Root = Styled.div`

`

const OverviewView: React.FC<Props> & Static = ({ ...props }) => {

    return (
        <Root {...props}>

        </Root>
    )

}

export default OverviewView