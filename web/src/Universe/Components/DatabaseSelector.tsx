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
            Database selector
        </Root>
    )

}

export default DatabaseSelector