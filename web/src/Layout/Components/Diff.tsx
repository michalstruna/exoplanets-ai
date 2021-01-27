import React from 'react'
import Styled from 'styled-components'
import { Color } from '../../Style'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    value?: number
    diff: number
    format?: (val: number) => React.ReactNode
    br?: boolean
}

interface DiffProps {
    prefix: string
    color: string
    bracket?: boolean
}

const meta = {
    negative: { prefix: '-', color: Color.RED },
    zero: { prefix: '±', color: Color.MEDIUM_LIGHT },
    positive: { prefix: '+', color: Color.GREEN }
}

const Root = Styled.div`
    white-space: nowrap;
`

const DiffVal = Styled.span<DiffProps>`
    color: ${props => props.color};
    font-size: 90%;
    vertical-align: top;

    &:before {
        content: "${props => (props.bracket ? '(' : '') + props.prefix}";
    }
    
    &:after {
        content: ${props => props.bracket ? '")"' : null}
    }
`

const Diff = ({ value, diff, format, br, ...props }: Props) => {

    const currentMeta = diff < 0 ? meta.negative : (diff > 0 ? meta.positive : meta.zero)

    if (value !== undefined) {
        return (
            <Root {...props}>
                {format!(value)} {br && <br />}<DiffVal {...currentMeta} bracket={false}>{format!(diff)}</DiffVal>
            </Root>
        )
    } else {
        return (
            <DiffVal {...currentMeta} {...props}>{format!(diff)}</DiffVal>
        )
    }
}

Diff.defaultProps = {
    format: (val: number) => val
}

export default Diff