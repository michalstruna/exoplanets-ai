import React from 'react'
import Styled from 'styled-components'
import useRouter from 'use-react-router'
import QueryString from 'query-string'

import Filter from '../Components/Filter'
import { Query, Urls } from '../../Routing'
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