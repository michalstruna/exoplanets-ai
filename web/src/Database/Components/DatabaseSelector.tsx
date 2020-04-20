import React from 'react'
import Styled from 'styled-components'

import { useFixedX } from '../../Style'
import { Paginator, FilterForm, useActions } from '../../Data'
import { setBodiesSegment, setBodiesFilter } from'../Redux/Reducer'
import { useBodies, useBodiesSegment } from '..'

interface Static {

}

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

const DatabaseSelector: React.FC<Props> & Static = ({ ...props }) => {

    const actions = useActions({ setBodiesSegment, setBodiesFilter })

    const root = React.useRef()
    useFixedX(root as any)
    const segment = useBodiesSegment()
    const bodies = useBodies()
    const bodiesCount = bodies.payload ? bodies.payload.count : 0

    return (
        <Root {...props} ref={root as any}>
            <div>
                <select>
                    <option>Hvězdy a planety</option>
                    <option>Hvězdy</option>
                    <option>Planety</option>
                </select>
            </div>
            <FilterForm
                attributes={['starName', 'starMass']}
                onChange={actions.setBodiesFilter}
            />
            <Paginator page={segment} itemsCount={bodiesCount} onChange={actions.setBodiesSegment} freeze={bodies.pending} />
        </Root>
    )

}

export default DatabaseSelector