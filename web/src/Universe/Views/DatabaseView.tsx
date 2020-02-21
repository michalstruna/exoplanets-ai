import React, { useMemo } from 'react'
import Styled from 'styled-components'
import useRouter from 'use-react-router'
import QueryString from 'query-string'

import Filter from '../Components/Filter'
import { Query, Urls } from '../../Routing'

interface Static {

}

interface Props {

}

const Root = Styled.div`

`

const DatabaseView: React.FC<Props> & Static = ({ ...props }) => {

    const { location } = useRouter()

    const initialFilter = React.useMemo(() => {
        const query = QueryString.parse(location.search)

        return {
            attribute: query[Query.FILTER_ATTRIBUTE],
            relation: query[Query.FILTER_RELATION],
            value: query[Query.FILTER_VALUE]
        }
    }, [])

    const [filter, setFilter] = React.useState(initialFilter)

    const handleFilter = filter => {
        setFilter(filter)

        Urls.replace({
            query: {
                [Query.FILTER_ATTRIBUTE]: filter.attribute,
                [Query.FILTER_RELATION]: filter.relation,
                [Query.FILTER_VALUE]: filter.value
            }
        })
    }

    const list = React.useMemo(() => {
        return null
    }, [filter])

    return (
        <Root {...props}>
            <Filter
                attributes={['starName', 'starMass']}
                keys={{ attribute: [Query.FILTER_ATTRIBUTE], relation: [Query.FILTER_RELATION], value: [Query.FILTER_VALUE] }}
                onChange={handleFilter}
                initialValues={initialFilter}
            />
            {list}
        </Root>
    )

}

export default DatabaseView