import React from 'react'
import Styled from 'styled-components'

import { Mixin, useFixedX } from '../../Utils'

interface Static {

}

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

const Root = Styled.div`
    ${Mixin.Size('100%', '10rem')}
`

const DatabaseSelector: React.FC<Props> & Static = ({ ...props }) => {

    const root = React.useRef<HTMLDivElement>()
    useFixedX(root.current)

    return (
        <Root {...props} ref={root}>
            SELECT [STARS_AND_PLANETS] WHERE [STAR.DIAMETER > 1000] ORDER BY [STAR.PLANETS] LIMIT [50] OFFSET [20]
        </Root>
    )

}

export default DatabaseSelector