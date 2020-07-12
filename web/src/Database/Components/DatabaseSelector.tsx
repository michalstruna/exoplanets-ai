import React from 'react'
import Styled from 'styled-components'

import { useFixedX } from '../../Style'
import { Paginator, FilterForm, useActions, useStrings } from '../../Data'
import { setSegment, setFilter, setTable } from '../Redux/Slice'
import { useBodies, useCursor, useTable } from '..'
import DbTable from '../Constants/DbTable'
import { provideFilterColumns } from '../Utils/StructureProvider'

interface Props extends React.ComponentPropsWithRef<'div'> {

}

const Root = Styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    max-width: calc(100% - 2rem);
    
    & > * {
        width: 33%;
    }
`

const DatabaseSelector = ({ ...props }: Props) => {

    const actions = useActions({ setSegment, setFilter, setTable })

    const root = React.useRef()
    useFixedX(root as any)
    const { segment, filter } = useCursor()
    const bodies = useBodies()
    const bodiesCount = bodies.payload ? bodies.payload.count : 0

    const table = useTable()
    const strings = useStrings()

    const filterColumns = React.useMemo(() => provideFilterColumns(table, strings.properties), [table]) as [string, string][]

    const tables = React.useMemo(() => (
        <select onChange={e => actions.setTable(e.target.value)}>
            {Object.values(DbTable).map((table, i) => (
                <option key={i} value={table}>
                    {table}
                </option>
            ))}
        </select>
    ), [])

    return (
        <Root {...props} ref={root as any}>
            <div>
                {tables}
            </div>
            <FilterForm
                attributes={filterColumns}
                onChange={actions.setFilter}
                initialValues={filter} />
            <Paginator
                page={segment}
                itemsCount={bodiesCount}
                onChange={actions.setSegment}
                freeze={bodies.pending} />
        </Root>
    )

}

export default DatabaseSelector