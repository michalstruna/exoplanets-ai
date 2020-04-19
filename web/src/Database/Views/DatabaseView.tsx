import React from 'react'
import Styled from 'styled-components'

import Database from '../Components/Database'
import DatabaseSelector from '../Components/DatabaseSelector'

interface Static {

}

interface Props {

}

const Root = Styled.div`

`

const DatabaseView: React.FC<Props> & Static = ({ ...props }) => {

    return (
        <Root {...props}>
            <DatabaseSelector />
            <Database />
        </Root>
    )

}

export default DatabaseView