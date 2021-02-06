import React from 'react'
import Styled from 'styled-components'

import { size } from '../../Style'

interface Props<Line> extends React.ComponentPropsWithoutRef<'div'> {
    lines: Line[]
    lineRenderer?: (line: Line, i: number) => React.ReactNode
    size?: number
}

const Root = Styled.div`
    ${size()}
    overflow-y: auto;
`

const Console = <Line extends any>({ lines, lineRenderer, size, ...props }: Props<Line>) => {

    const memoLines = React.useMemo(() => (
        lines.slice(0, size).map((line, i) => lineRenderer!(line, i))
    ), [lines, lineRenderer, size])

    return (
        <Root {...props}>
            {memoLines}
        </Root>
    )
    
}

Console.defultProps = {
    lineRenderer: (line: any) => line,
    size: Infinity
}

Console.Root = Root

export default Console