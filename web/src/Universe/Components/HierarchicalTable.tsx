import React from 'react'
import Styled, { css } from 'styled-components'

import { Color, Mixin, ZIndex } from '../../Utils'

interface Static {
    Cell: string
    Header: string
    Primary: string
    Row: string
    Secondary: string
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

const Row = Styled.div`    
    &:nth-of-type(2n + 1) {
        background-color: rgba(0, 0, 0, 0.15);
    }
`

const Primary = Styled.div`
    ${Mixin.Size()}
    overflow: hidden;
    white-space: nowrap;
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

const Secondary = Styled.div`
    ${Row}:nth-of-type(2n + 1) {
        background-color: rgba(0, 0, 0, 0.1);
    }
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
                <Primary>
                    {levels[levelIndex].columns.map((column: Column<any, any>, i) => (
                        <Cell key={i} icon={column.headerIcon || column.icon} data-level={levelIndex} data-header>
                            {column.title}
                        </Cell>
                    ))}
                </Primary>
                {levelIndex < levels.length - 1 && (
                    <Secondary>
                        {renderHeader(levelIndex + 1)}
                    </Secondary>
                )}
            </>
        )

        return (
            <Header>
                {renderHeader(0)}
            </Header>
        )
    }, [])

    const renderedItems = React.useMemo(() => {
        const renderItems = (items: any[], levelIndex: number) => {
            return items.map((item, i) => (
                <Row key={i}>
                    <Primary>
                        {levels[levelIndex].columns.map((column, j) => (
                            <Cell key={j} icon={column.icon} data-level={levelIndex}>
                                {column.render ? column.render(column.accessor(item), item) : column.accessor(item)}
                            </Cell>
                        ))}
                    </Primary>
                    {levelIndex < levels.length - 1 && (
                        <Secondary>
                            {renderItems(levels[levelIndex + 1].accessor(item), levelIndex + 1)}
                        </Secondary>
                    )}
                </Row>
            ))
        }

        return renderItems(items, 0)
    }, [])

    return (
        <Root {...props}>
            {renderedHeader}
            {renderedItems}
        </Root>
    )

}

HierarchicalTable.Cell = Cell
HierarchicalTable.Header = Header
HierarchicalTable.Primary = Primary
HierarchicalTable.Row = Row
HierarchicalTable.Secondary = Secondary

export default HierarchicalTable