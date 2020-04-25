import React from 'react'
import Styled from 'styled-components'

import { size, threeDots } from '../../Style'

interface Props<Item> extends React.ComponentPropsWithoutRef<'div'> {
    items: Item[]
    columns: Column<Item>[]
    withHeader?: boolean
}

interface Column<Item> {
    accessor: (item: Item, index: number) => any
    render?: (value: any, item: Item, index: number) => React.ReactNode
    title?: React.ReactNode
}

const Root = Styled.div`
    ${size()}
    display: table;
`

const Row = Styled.div`
    display: table-row;
    
    &:nth-of-type(2n + 1) {
        background-color: rgba(0, 0, 0, 0.1);
    }
`

const Cell = Styled.div`
    ${threeDots()}
    display: table-cell;
    overflow: hidden;
    padding: 0.5rem;
    vertical-align: middle;
    width: auto;
    
    &:first-of-type {
        padding-left: 1rem;
    }
    
    &:last-of-type {
        padding-right: 1rem;
    }
`

const HeaderRow = Styled(Row)`
    font-weight: bold;
`

const HeaderCell = Styled(Cell)`

`

function Table<Item>({ columns, items, withHeader, ...props }: Props<Item>) {

    const renderedHeader = React.useMemo(() => withHeader && (
        <HeaderRow>
            {columns.map((column, i) => (
                <HeaderCell key={i}>
                    {column.title || ''}
                </HeaderCell>
            ))}
        </HeaderRow>
    ), [columns, withHeader])

    const renderedItems = React.useMemo(() => (
        items.map((item, i) => (
            <Row key={i}>
                {columns.map((column, j) => (
                    <Cell key={j}>
                        {column.render ? column.render(column.accessor(item, i), item, i) : column.accessor(item, i)}
                    </Cell>
                ))}
            </Row>
        ))
    ), [items, columns])

    return (
        <Root {...props}>
            {renderedHeader}
            {renderedItems}
        </Root>
    )
}

Table.Root = Root
Table.Row = Row
Table.Cell = Cell
Table.HeaderRow = HeaderRow
Table.HeaderCell = HeaderCell
Table.Root = Root

Table.defaultProps = {
    withHeader: true
}

export default Table