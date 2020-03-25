import React from 'react'
import Styled, { css } from 'styled-components'

import { Color, Mixin, ZIndex, VirtualizedList, Duration, useSort } from '../../Utils'

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
    onSort?: (sortedIndex: number, isAsc: boolean, sortedLevel: number) => void
    defaultSort?: { column: number, isAsc: boolean, level: number }
}

const Root = Styled.div`

`

interface RowProps {
    isOdd?: boolean
}

const Row = Styled.div<RowProps>`    
    white-space: nowrap;
    min-width: 100%;
    
    ${props => props.isOdd && `
        background-color: rgba(0, 0, 0, 0.15);
    `}
`

interface CellProps {
    icon?: string
}

const Cell = Styled.div<CellProps>`
    align-items: center;
    box-sizing: border-box;
    display: inline-flex;
    padding: 0.5rem 1rem;
    vertical-align: middle;
    transition: background-color ${Duration.MEDIUM};
    width: 10rem;
    
    &:not(:first-of-type):not([data-header]):nth-of-type(2n + 1) {
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
    background-color: ${Color.DARKEST};
    position: sticky;
    top: 0;
    z-index: ${ZIndex.TABLE_HEADER};

    ${Cell} {
        background-color: ${Color.DARKEST};
        border-bottom: 2px solid transparent;
        border-top: 2px solid transparent;
        cursor: pointer;
        user-select: none;
        
        &:hover {
            background-color: ${Color.MEDIUM_DARK};
        }
        
        &:after {
            border: 5px solid transparent;
            content: "";
            display: inline-block;
            margin-left: 0.5rem;
        }
        
        &[data-sorted="asc"] {
            &:after {
                border-top-color: ${Color.LIGHT};
                transform: translateY(25%);
            }
        }
        
        &[data-sorted="desc"] {
            &:after {
                border-bottom-color: ${Color.LIGHT};
                transform: translateY(-25%);
            }
        }
        
     }
`

const compare = (a, b) => {
    if (a > b) {
        return 1
    } else if (a < b) {
        return -1
    } else {
        return 0
    }
}

const HierarchicalTable: React.FC<Props> & Static = ({ levels, items, onSort, defaultSort, ...props }) => {

    const getSortedItems = () => {
        const copyItems = JSON.parse(JSON.stringify(items)) // TODO: Deep clone.

        // TODO: Generalize. Now it's working only for two levels.
        const accessor = levels[sortedLevel].columns[sortedColumn].accessor

        if (sortedLevel === 0) {
            return [...copyItems].sort((a, b) => compare(accessor(a), accessor(b)) * (isAsc ? 1 : -1))
        } else if (sortedLevel === 1) {
            const levelAccessor = levels[sortedLevel].accessor
            const defaultValue = isAsc ? Infinity : -Infinity

            const result = [...copyItems]

            for (const item of result) {
                levelAccessor(item).sort((a, b) => compare(accessor(a), accessor(b)) * (isAsc ? 1 : -1))
            }

            result.sort((a, b) => (
                compare(levelAccessor(a)[0] ? accessor(levelAccessor(a)[0]) : defaultValue, levelAccessor(b)[0] ? accessor(levelAccessor(b)[0]) : defaultValue) * (isAsc ? 1 : -1)
            ))

            return result
        }

        return items
    }

    const { sort, sortedLevel, sortedColumn, isAsc } = useSort(defaultSort.column, defaultSort.isAsc, defaultSort.level)
    const [sortedItems, setSortedItems] = React.useState(getSortedItems())

    React.useEffect(() => {
        if (onSort) {
            onSort(sortedColumn, isAsc, sortedLevel)
        }

        setSortedItems(getSortedItems())

    }, [sortedLevel, sortedColumn, isAsc, items])

    const renderedHeader = React.useMemo(() => {
        const renderHeader = (levelIndex: number) => (
            <>
                <Header>
                    {levels[levelIndex].columns.map((column: Column<any, any>, i) => (
                        <Cell
                            key={i}
                            icon={column.headerIcon || column.icon}
                            data-level={levelIndex}
                            data-header
                            data-sorted={sortedLevel === levelIndex && sortedColumn === i ? (isAsc ? 'asc' : 'desc') : undefined}
                            onClick={() => sort(i, levelIndex)}>
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
    }, [sort])

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

        process(sortedItems, 0)

        return rows
    }, [sortedItems])

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