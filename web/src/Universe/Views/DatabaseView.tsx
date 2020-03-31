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

    const { location } = useRouter()

    const initialFilter = React.useMemo(() => (
        QueryString.parse(location.search, { parseNumbers: true })
    ), [])

    const [filter, setFilter] = React.useState(initialFilter)

    const handleFilter = filter => {
        setFilter(filter)
        Urls.replace({ query: filter })
    }

    /**
     <Filter
     attributes={['starName', 'starMass']}
     keys={{ attribute: Query.FILTER_ATTRIBUTE, relation: Query.FILTER_RELATION, value: Query.FILTER_VALUE }}
     onChange={handleFilter}
     initialValues={initialFilter}
     />
     */

    return (
        <Root {...props}>
            <DatabaseSelector />
            <Database />
        </Root>
    )

}

export default DatabaseView