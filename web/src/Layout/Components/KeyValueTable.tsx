import React from 'react'
import Styled from 'styled-components'
import { Mixins } from '../../Style'

interface Static {
    Row: string
    Cell: string
}

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    data: [React.ReactNode, React.ReactNode][]
}

const Root = Styled.div`
    overflow: hidden;
`

const Row = Styled.div`
    display: flex;
    width: 100%;
`

const Cell = Styled.div`
    ${Mixins.Size()}
    ${Mixins.ThreeDots()}
    box-sizing: border-box;
    padding: 0 0.5rem;
    white-space: nowrap;
    
    &:first-of-type {
        text-align: right;
    }
    
    &:nth-of-type(2) {
        text-align: left;
    }
`

const KeyValueTable: React.FC<Props> & Static = ({ data, ...props }) => {

    const renderedCells = React.useMemo(() => (
        data.map((row, i) => (
            <Row key={i}>
                {row.map((cell, j) => (
                    <Cell key={j}>
                        {cell}
                    </Cell>
                ))}
            </Row>
        ))
    ), [data])

    return (
        <Root {...props}>
            {renderedCells}
        </Root>
    )

}

KeyValueTable.Cell = Cell
KeyValueTable.Row = Row

export default KeyValueTable