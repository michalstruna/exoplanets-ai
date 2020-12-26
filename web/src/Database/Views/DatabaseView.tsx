import React from 'react'
import Styled from 'styled-components'

import Database from '../Components/Database'
import DatabaseSelector from '../Components/DatabaseSelector'

interface Props {

}

const DatabaseView = ({}: Props) => {

    return (
        <>
            <DatabaseSelector />
            <Database />
        </>
    )

}

export default DatabaseView