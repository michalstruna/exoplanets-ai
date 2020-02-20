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

    const handleFilter = filter => {
        Urls.replace({
            query: {
                [Query.FILTER_ATTRIBUTE]: filter.map(item => item.attribute),
                [Query.FILTER_RELATION]: filter.map(item => item.relation),
                [Query.FILTER_VALUE]: filter.map(item => item.value)
            }
        })
    }

    const initFilter = React.useMemo(() => {
        const _query = QueryString.parse(location.search)
        const query = {}
        let length = 0

        for (const i in _query) {
            query[i] = Array.isArray(_query[i]) ? _query[i] : [_query[i]]

            if (!length) {
                length = query[i].length
            }

            if (length !== query[i].length) {
                return undefined
            }
        }

        if (!query[Query.FILTER_ATTRIBUTE]) {
            return undefined
        }

        return query[Query.FILTER_ATTRIBUTE].map((value, i) => ({
            attribute: query[Query.FILTER_ATTRIBUTE][i],
            relation: query[Query.FILTER_RELATION][i],
            value: query[Query.FILTER_VALUE][i]
        }))
    }, [])

    return (
        <Root {...props}>
            <Filter handleChange={handleFilter} initialValues={initFilter} />
        </Root>
    )

}

export default DatabaseView