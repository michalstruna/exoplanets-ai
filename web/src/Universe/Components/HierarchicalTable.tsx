import React from 'react'
import Styled, { css } from 'styled-components'

import { Color, Mixin, ZIndex, VirtualizedList } from '../../Utils'

interface Static {
    Cell: string
    Header: string
    Row: string
}

interface Column<TItem, TValue> {
    title: React.ReactNode
    accessor: (item: TItem) => TValue
    render?: (value: TValue, item: TItem) => React.ReactNode
    icon?: string
    headerIcon?: string
}

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    items: any[]
    levels: {
        columns: Column<any, string | number | boolean>[] // TODO: Remove any.
        accessor?: (item: any) => any[]
    }[]
}

const Root = Styled.div`

`

interface RowProps {
    isOdd?: boolean
}

const Row = Styled.div<RowProps>`    
    white-space: nowrap;
    width: 100%;
    
    ${props => props.isOdd && `
        background-color: rgba(0, 0, 0, 0.15);
    `}
`

interface CellProps {
    icon?: string
}

const Cell = Styled.div<CellProps>`
    align-items: center;
    display: inline-flex;
    padding: 0.5rem 1rem;
    vertical-align: middle;
    width: 8rem;
    
    &:not(:first-of-type):nth-of-type(2n + 1) {
        background-color: rgba(0, 0, 0, 0.07);
    }
    
    ${props => props.icon && css`
        &:before {
            ${Mixin.Image(null)}
            ${Mixin.Size('1.2rem')}
            background-image: url("${props.icon}");
            content: "";
            display: inline-block;
            margin-right: 0.5rem;
        }
    `}
`

const Header = Styled(Row)`
    position: sticky;
    top: 0;
    z-index: ${ZIndex.TABLE_HEADER};

    && {
        background-color: ${Color.DARKEST};
    }
`

const HierarchicalTable: React.FC<Props> & Static = ({ levels, items, ...props }) => {

    const renderedHeader = React.useMemo(() => {
        const renderHeader = (levelIndex: number) => (
            <>
                <Header>
                    {levels[levelIndex].columns.map((column: Column<any, any>, i) => (
                        <Cell key={i} icon={column.headerIcon || column.icon} data-level={levelIndex} data-header>
                            {column.title}
                        </Cell>
                    ))}
                </Header>
                {levelIndex < levels.length - 1 && renderHeader(levelIndex + 1)}
            </>
        )

        return (
            <Header>
                {renderHeader(0)}
            </Header>
        )
    }, [])

    const rows = React.useMemo(() => {
        const rows = []

        const process = (items, level) => {
            items.map(item => {
                rows.push({ level, item })

                if (level < levels.length - 1) {
                    process(levels[level + 1].accessor(item), level + 1)
                }
            })
        }

        process(items, 0)

        return rows
    }, [])

    const renderRow = ({ index, style }) => {
        const { item, level } = rows[index]

        return (
            <Row key={index} style={style} isOdd={index % 2 === 1}>
                {levels[level].columns.map((column, j) => (
                    <Cell key={j} icon={column.icon} data-level={level}>
                        {column.render ? column.render(column.accessor(item), item) : column.accessor(item)}
                    </Cell>
                ))}
            </Row>
        )
    }
    
    // TODO: InfiniteLoader.
    return (
        <Root {...props}>
            {renderedHeader}
            <VirtualizedList
                itemsCount={rows.length}
                itemRenderer={renderRow}
                itemHeight={index => rows[index].level === 0 ? 96 : 72}
                scrollable={document.querySelector('#scrollable-root')} />
        </Root>
    )

}

HierarchicalTable.Cell = Cell
HierarchicalTable.Header = Header
HierarchicalTable.Row = Row

export default HierarchicalTable