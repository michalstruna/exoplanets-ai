import React from 'react'
import Styled from 'styled-components'
import { bindActionCreators } from 'redux'
import { useDispatch } from 'react-redux'

import { Paginator, useFixedX } from '../../Utils'
import Filter from './Filter'
import { setBodiesSegment, setBodiesFilter } from'../Redux/Reducer'
import { useBodies, useBodiesSegment } from '..'

interface Static {

}

interface Props extends React.ComponentPropsWithoutRef<'div'> {

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

    const actions = bindActionCreators({ setBodiesSegment, setBodiesFilter }, useDispatch())

    const root = React.useRef()
    useFixedX(root)
    const segment = useBodiesSegment()
    const bodies = useBodies()
    const bodiesCount = bodies.payload ? bodies.payload.count : 0

    return (
        <Root {...props} ref={root}>
            <div>
                SELECT [STARS_AND_PLANETS] WHERE [STAR.DIAMETER > 1000] ORDER BY [STAR.PLANETS] LIMIT [50] OFFSET [20]
            </div>
            <Filter
                attributes={['starName', 'starMass']}
                onChange={actions.setBodiesFilter}
            />
            <Paginator page={segment} itemsCount={bodiesCount} onChange={actions.setBodiesSegment} freeze={bodies.pending} />
        </Root>
    )

}

export default DatabaseSelector