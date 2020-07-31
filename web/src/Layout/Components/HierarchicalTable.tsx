import React from 'react'
import Styled, { css } from 'styled-components'

import { useSort } from '../../Data'
import { Color, size, image, Duration, ZIndex } from '../../Style'
import { Column, Level, Sort } from '../types'
import { useElement } from '../../Native'
import VirtualizedList from './VirtualizedList'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    items: any[]
    levels: Level[]
    onSort?: (sort: Sort) => void
    defaultSort?: { column: number, isAsc: boolean, level: number }
    renderBody?: (body: React.ReactNode) => React.ReactNode
    renderHeader?: (header: React.ReactNode) => React.ReactNode
    rowHeight?: (row: number, level: number) => number
}

const Root = Styled.div`

`

interface RowProps {
    isOdd?: boolean
}

const Row = Styled.div<RowProps>`    
    align-items: stretch;
    white-space: nowrap;
    min-width: 100%;
    
    ${props => props.isOdd && `
        background-color: rgba(0, 0, 0, 0.15);
    `}
`

interface CellProps {
    icon?: string
    interactive?: boolean
}

const Cell = Styled.div<CellProps>`
    align-items: center;
    box-sizing: border-box;
    display: inline-flex;
    flex: 1 1 0;
    height: 100%;
    padding: 0.5rem 1rem;
    vertical-align: middle;
    transition: background-color ${Duration.MEDIUM};
    
    &:not(:first-of-type):not([data-header]):nth-of-type(2n + 1) {
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
    
    ${props => props.interactive && css`
        padding: 0;
        
        & > a, & > button, & > div, & > p {
            box-sizing: border-box;
            padding: 0.5rem 1rem;
        }
    `}
`

const Header = Styled.div`
    background-color: ${Color.DARKEST};
    position: sticky;
    top: 0;
    z-index: ${ZIndex.TABLE_HEADER};
`

const HeaderRow = Styled(Row)`
    background-color: ${Color.DARKEST};
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

// TODO: Generic types. Current = level == 0 ? T1 : T2?
const HierarchicalTable = ({ levels, items, onSort, defaultSort, renderBody, renderHeader, rowHeight, ...props }: Props) => {

    const { sort, sortedLevel, sortedColumn, isAsc } = useSort((defaultSort as any).column, (defaultSort as any).isAsc, (defaultSort as any).level)
    const { app } = useElement()

    const getWidth = (width?: number | string) => {
        if (typeof width === 'string') {
            return { width: `${width}` }
        } else {
            return { width: `${(width ?? 1) * 10}rem` }
        }
    }

    React.useEffect(() => {
        if (onSort) {
            onSort({ column: sortedColumn, isAsc, level: sortedLevel })
        }

    }, [sortedLevel, sortedColumn, isAsc, items, onSort])

    const renderedHeader = React.useMemo(() => {
        const renderHeader = (levelIndex: number): React.ReactNode => (
            <>
                <HeaderRow>
                    {levels[levelIndex].columns.map((column: Column<any, any>, i) => (
                        <Cell
                            style={getWidth(column.width)}
                            key={i}
                            icon={column.headerIcon || column.icon}
                            data-level={levelIndex}
                            data-header
                            data-sorted={sortedLevel === levelIndex && sortedColumn === i ? (isAsc ? 'asc' : 'desc') : undefined}
                            onClick={() => sort(i, levelIndex)}>
                            {column.title}
                        </Cell>
                    ))}
                </HeaderRow>
                {levelIndex < levels.length - 1 && renderHeader(levelIndex + 1)}
            </>
        )

        return (
            <Header>
                {renderHeader(0)}
            </Header>
        )
    }, [sort, isAsc, levels, sortedColumn, sortedLevel])

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

        return (
            <Row key={index} style={{ ...style, height: rowHeight!(index, level) + 'px' }} isOdd={index % 2 === 1} data-is-odd={index % 2 === 1}>
                {levels[level].columns.map((column, j) => (
                    <Cell key={j} icon={column.icon} data-level={level} style={getWidth(column.width)} interactive={column.interactive}>
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
            {headerRenderer(renderedHeader)}
            {bodyRenderer(
                <VirtualizedList
                    itemsCount={rows.length}
                    itemRenderer={renderRow}
                    itemHeight={index => rowHeight!(index, rows[index].level)}
                    scrollable={app} />
            )}
        </Root>
    )

}

HierarchicalTable.Cell = Cell
HierarchicalTable.Header = Header
HierarchicalTable.Row = Row

HierarchicalTable.defaultProps = {
    defaultSort: { column: 0, isAsc: true, level: 0 },
    rowHeight: () => 40
}

export default HierarchicalTable