import React from 'react'
import Styled from 'styled-components'

import { Link } from '../../Routing'
import { Color } from '../../Style'

interface Props extends React.ComponentPropsWithoutRef<'sup'> {
    refMap?: Record<string, number>
    refs?: string | (string | undefined)[]
}

const Root = Styled.sup`
    display: inline-block;
    font-weight: normal;
`

const RefLink = Styled(Link)`
    color: ${Color.BLUE};
    font-size: 90%;
    margin-right: 0.3em;
    
    &:not(:hover) {
        border-bottom: 1px solid ${Color.BLUE};
    }
`

const Ref = ({ refMap, refs, ...props }: Props) => {

    const allRefs = Array.isArray(refs) ? refs : [refs]

    return (
        <Root {...props}>
            {allRefs.map(ref => {
                if (ref === undefined) {
                    return null
                }

                const refIndex = refMap?.[ref]

                if (refIndex === undefined) {
                    return null
                }

                return <RefLink hash={'ref' + refIndex}>[{refIndex}]</RefLink>
            })}
        </Root>
    )

}

export default Ref