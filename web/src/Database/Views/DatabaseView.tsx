import React from 'react'

import Database from '../Components/Database'
import DatabaseSelector from '../Components/DatabaseSelector'

const DatabaseView = () => {

    return (
        <>
            <DatabaseSelector />
            <Database />
        </>
    )

}

export default DatabaseView