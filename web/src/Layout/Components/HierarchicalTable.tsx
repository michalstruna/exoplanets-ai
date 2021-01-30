import React from 'react'
import Styled, { css } from 'styled-components'

import { useSort } from '../../Data'
import { Color, size, image, Duration, ZIndex } from '../../Style'
import { Column, Level } from '../types'
import { Sort } from '../../Data'
import { useElement } from '../../Native'
import VirtualizedList from './VirtualizedList'
import IconText from './IconText'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    items: any[] // List of rendered items.
    columns: Column<any, any>[] | Level[] // Simple list of columns or list of columns in separated levels.
    onSort?: (sort: Partial<Sort>) => void // Handler for sort.
    defaultSort?: Partial<Sort>
    renderBody?: (body: React.ReactNode) => React.ReactNode
    renderHeader?: (header: React.ReactNode) => React.ReactNode
    rowHeight?: (row: number, level: number) => number
    withHeader?: boolean
    virtualized?: boolean
    fixedWidth?: boolean
}

const Root = Styled.div`

`

interface RowProps {
    isOdd?: boolean
    flex?: boolean
}

const Row = Styled.div<RowProps>`    
    align-items: stretch;
    ${props => props.flex ? 'display: flex;' : null}
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
    height: 100%;
    padding: 0.5rem 1rem;
    position: relative;
    vertical-align: middle;
    transition: background-color ${Duration.MEDIUM};
    
    &:not([data-header]):nth-of-type(2n + 1) {
        background-color: rgba(0, 0, 0, 0.07);
    }
        
    ${props => props.icon && css`
        &:before {
            ${image(undefined)}
            ${size('1.2rem')}
            background-image: url("${props.icon}");
            content: "";
            display: inline-block;
            margin-right: 0.5rem;
            min-width: 1.2rem;
        }
    `}
    
    &[data-sorted]:not([data-header]) {
        &:after {

        }
    }
    
    ${IconText.Root} {
        height: auto;
    }
`

const Header = Styled.div`
    position: sticky;
    top: 0;
    z-index: ${ZIndex.TABLE_HEADER};
`

const HeaderRow = Styled(Row)`
    position: sticky;
    top: 0;
    z-index: ${ZIndex.TABLE_HEADER};

    ${Cell} {
        background-color: ${Color.DARKEST};
        border-bottom: 2px solid transparent;
        border-top: 2px solid transparent;
        height: 2.5rem;
        cursor: pointer;
        user-select: none;
        
        &:empty {
            pointer-events: none;
        }
        
        &:hover {
            background-color: ${Color.DARKEST_HOVER};
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

const getWidth = (width?: number | string, fixedWidth?: boolean) => {
    if (typeof width === 'string') {
        return { width: `${width}` }
    } else {
        return fixedWidth ? { flex: width ?? 1, width: '100%' } : { width: `${(width ?? 1) * 10}rem` }
    }
}

// TODO: Generic types. Current = level == 0 ? T1 : T2?
const HierarchicalTable = ({
                               columns,
                               withHeader,
                               virtualized,
                               items,
                               onSort,
                               defaultSort,
                               renderBody,
                               renderHeader,
                               rowHeight,
                               fixedWidth,
                               ...props
                           }: Props) => {

    const levels: Level[] = 'columns' in columns[0] ? columns as Level[] : [{ columns: (columns as Column<any, any>[]) }]
    const { sort, sortedLevel, sortedColumn, isAsc } = useSort(defaultSort?.column, defaultSort?.isAsc, defaultSort?.level)
    const { app } = useElement()

    React.useEffect(() => { // Update sort.
        if (onSort && levels[sortedLevel!] && levels[sortedLevel!].columns[sortedColumn!]) {
            onSort({ column: sortedColumn, isAsc, level: sortedLevel, columnName: levels[sortedLevel!].columns[sortedColumn!].name })
        } else if (onSort && sortedLevel === undefined && sortedColumn === undefined && isAsc === undefined) {
            onSort({})
        }
    }, [sortedLevel, sortedColumn, isAsc, items, onSort, levels])

    const renderedHeader = React.useMemo(() => {
        return (
            <Header>
                {levels.map((level, levelIndex) => (
                    <HeaderRow flex={fixedWidth} key={levelIndex}>
                        {level.columns.map((column: Column<any, any>, i) => (
                            <Cell key={i} style={getWidth(column.width, fixedWidth)} icon={column.headerIcon || column.icon}
                                data-level={levelIndex} data-header onClick={() => sort(i, levelIndex)}
                                data-sorted={onSort && sortedLevel === levelIndex && sortedColumn === i ? (isAsc ? 'asc' : 'desc') : undefined}>
                                {column.title}
                            </Cell>
                        ))}
                    </HeaderRow>
                ))}
            </Header>
        )
    }, [sort, isAsc, levels, sortedColumn, sortedLevel, fixedWidth, getWidth])

    const rows = React.useMemo(() => {
        const rows = [] as any

        const process = (items: any, level: any) => {
            for (const item of items) {
                rows.push({ level, item })

                if (level < levels.length - 1) {
                    process((levels as any)[level + 1].accessor(item), level + 1)
                }
            }
        }

        process(items, 0)

        return rows
    }, [items, levels])

    const renderRow = ({ index, style }: any) => {
        const { item, level } = rows[index]
        const styles = style || rowHeight ? { ...style, height: rowHeight && (rowHeight!(index, level) + 'px') } : undefined
        const isOdd = index % 2 === 1

        return (
            <Row key={index} style={styles} isOdd={isOdd} flex={fixedWidth} data-is-odd={isOdd || undefined}>
                {levels[level].columns.map((column, j) => (
                    <Cell key={j} icon={column.icon} data-level={level} style={getWidth(column.width, fixedWidth)}
                          data-sorted={onSort && sortedLevel === level && sortedColumn === j ? (isAsc ? 'asc' : 'desc') : undefined}>
                        {column.render ? column.render(column.accessor(item, index), item, index) : column.accessor(item, index)}
                    </Cell>
                ))}
            </Row>
        )
    }

    const headerRenderer = renderHeader ? renderHeader : (header: any) => header
    const bodyRenderer = renderBody ? renderBody : (body: any) => body

    return (
        <Root {...props}>
            {withHeader && headerRenderer(renderedHeader)}
            {bodyRenderer(virtualized ? (
                <VirtualizedList
                    itemsCount={rows.length}
                    itemRenderer={renderRow}
                    itemHeight={i => rowHeight!(i, rows[i].level)}
                    scrollable={app} />
            ) : rows.map((row: any, index: number) => renderRow({ row, index })))}
        </Root>
    )

}

HierarchicalTable.Cell = Cell
HierarchicalTable.Header = Header
HierarchicalTable.Row = Row

HierarchicalTable.defaultProps = {
    defaultSort: { column: 0, isAsc: true, level: 0 },
    withHeader: true,
    virtualized: false,
    fixedWidth: true
}

export default HierarchicalTable