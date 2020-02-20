import React from 'react'
import Styled from 'styled-components'
import Filter from '../Components/Filter'

interface Static {

}

interface Props {

}

const Root = Styled.div`

`

const DatabaseView: React.FC<Props> & Static = ({ ...props }) => {

    return (
        <Root {...props}>
            <Filter />
        </Root>
    )

}

export default DatabaseView