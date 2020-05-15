import React from 'react'
import Styled from 'styled-components'

import Database from '../Components/Database'
import DatabaseSelector from '../Components/DatabaseSelector'

interface Props {

}

const Root = Styled.div`

`

const DatabaseView = ({ ...props }: Props) => {

    return (
        <Root {...props}>
            <DatabaseSelector />
            <Database />
        </Root>
    )

}

export default DatabaseView