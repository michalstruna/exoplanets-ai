import React from 'react'

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