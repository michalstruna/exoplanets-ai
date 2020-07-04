import React from 'react'
import Styled from 'styled-components'

import { useFixedX } from '../../Style'
import { Paginator, FilterForm, useActions } from '../../Data'
import { setBodiesSegment, setBodiesFilter, setTable } from '../Redux/Slice'
import { useBodies, useBodiesFilter, useBodiesSegment } from '..'
import DbTable from '../Constants/DbTable'

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

    const actions = useActions({ setBodiesSegment, setBodiesFilter, setTable })

    const root = React.useRef()
    useFixedX(root as any)
    const segment = useBodiesSegment()
    const filter = useBodiesFilter()
    const bodies = useBodies()
    const bodiesCount = bodies.payload ? bodies.payload.count : 0

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
                attributes={['starName', 'starMass']}
                onChange={actions.setBodiesFilter}
                initialValues={filter} />
            <Paginator
                page={segment}
                itemsCount={bodiesCount}
                onChange={actions.setBodiesSegment}
                freeze={bodies.pending} />
        </Root>
    )

}

export default DatabaseSelector