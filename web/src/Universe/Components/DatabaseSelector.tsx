import React from 'react'
import Styled from 'styled-components'

import { useFixedX } from '../../Utils'
import Filter from './Filter'

interface Static {

}

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

const Root = Styled.div`

`

const DatabaseSelector: React.FC<Props> & Static = ({ ...props }) => {

    const root = React.useRef<HTMLDivElement>()
    useFixedX(root.current)

    const handleFilter = () => {

    }

    return (
        <Root {...props} ref={root}>
            <Filter
                attributes={['starName', 'starMass']}
                onChange={handleFilter}
            />
            SELECT [STARS_AND_PLANETS] WHERE [STAR.DIAMETER > 1000] ORDER BY [STAR.PLANETS] LIMIT [50] OFFSET [20]
        </Root>
    )

}

export default DatabaseSelector