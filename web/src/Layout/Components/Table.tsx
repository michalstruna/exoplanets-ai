import React from 'react'
import Styled from 'styled-components'
import { Mixin } from '../../Utils'

interface Props<Item> extends React.ComponentPropsWithoutRef<'div'> {
    items: Item[]
    columns: Column<Item>[]
}

interface Column<Item> {
    accessor: (item: Item, number) => any
    render?: (value: any, item: Item, index: number) => React.ReactNode
    title?: React.ReactNode
}

const Root = Styled.div`
    ${Mixin.Size()}
    display: table;
`

const Row = Styled.div`
    display: table-row;
    
    &:nth-of-type(2n + 1) {
        background-color: rgba(0, 0, 0, 0.1);
    }
`

const Cell = Styled.div`
    display: table-cell;
    padding: 0.5rem;
    
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

function Table<Item>({ columns, items, ...props }: Props<Item>) {

    const renderedHeader = React.useMemo(() => (
        <HeaderRow>
            {columns.map((column, i) => (
                <HeaderCell key={i}>
                    {column.title || ''}
                </HeaderCell>
            ))}
        </HeaderRow>
    ), [columns])

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

export default Table