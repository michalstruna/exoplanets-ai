import React from 'react'
import Styled from 'styled-components'

import { useActions, useStrings, Sort } from '../../Data'
import { useDrag, useElement } from '../../Native'
import { image, size, ZIndex } from '../../Style'
import { HierarchicalTable, PrimaryButton } from '../../Layout'
import { setSort, useCursor, useItems, useTable, useTableColumns } from '..'
import { Async } from '../../Async'
import DbTable from '../Constants/DbTable'
import TableItemDetail from './TableItemDetail'
import Tooltip from '../../Layout/Components/Tooltip'
import DatasetForm from './DatasetForm'
import { useDispatch } from 'react-redux'

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

const Root = Styled.div`
    user-select: none;
`

const Table = Styled(HierarchicalTable)`    
    ${HierarchicalTable.Cell} {
        min-width: 10rem;
        
        &:first-of-type {
            font-size: 85%;
            pointer-events: none;
            min-width: 3rem;
        }
        
        &:nth-of-type(2) {
            padding-right: 0;
            position: relative;
            z-index: ${ZIndex.TABLE_BODY_ICON};
            min-width: 0;
        }
        
        &:nth-of-type(3) {
            &:hover {
                ${TableItemDetail.Root}:after {
                    opacity: 1;
                    transform: scale(1.3) translateX(25%);
                }
            }
        }
        
        &[data-header] {
            height: 2.5rem;
        }
    }

    ${HierarchicalTable.Row} {
        &[data-is-odd="true"] {
            ${HierarchicalTable.Cell}:nth-of-type(3):not([data-header]) {
                background-color: #2F2F2F;
            }
        }
    
        &[data-is-odd="false"] {
            ${HierarchicalTable.Cell}:nth-of-type(3):not([data-header]) {
                background-color: #383838;
            }
        }
    }

    ${HierarchicalTable.Cell} {        
        &:nth-of-type(3) {
            border-right: 2px solid black;
            left: 0;
            position: sticky;
            z-index: ${ZIndex.TABLE_BODY_NAME};
        }
    }
    
    &.table--${DbTable.BODIES} {     
        ${HierarchicalTable.Cell} {                    
            &:nth-of-type(10) {            
                &:not([data-header])[data-level="0"] {

                }
            }
            
            &[data-level="1"] {
                &:nth-of-type(2) {
                    margin-left: 3rem;
                    margin-right: -3rem;
                }
                
                &:nth-of-type(3) {
                    padding-left: 3rem;
                }
            }
            
            &[data-header] {
                &[data-level="0"] {
                     &:nth-of-type(1) {
                        transform: translateY(1rem);
                    }
                }
            
                &[data-level="1"] {   
                    &:nth-of-type(1) {
                        visibility: hidden;
                    }
                             
                    &:nth-of-type(2) {
                        width: 5rem !important;
                    }
                
                    &:nth-of-type(3) {
                        padding-left: 3rem;
                    }
                }
            }
        }
    }
`

const Add = Styled.div`
    bottom: 3rem;
    position: fixed;
    right: 3rem;
`

const AddButton = Styled(PrimaryButton)`
    ${image('Controls/Add.svg', '40%')}
    ${size('3rem')}
`

const addSetCoords = () => ({ x: window.innerWidth - 65, y: window.innerHeight - 80 })

const Database = ({ ...props }: Props) => {

    let { filter, segment, sort } = useCursor()
    const actions = useActions({ setSort })
    const table = useTable()
    const { app } = useElement()
    const items = useItems(table)
    const { levels, rowHeight, getter } = useTableColumns()

    const handleSort = (newSort: Partial<Sort>) => {
        if (newSort.column !== sort.column || newSort.isAsc !== sort.isAsc || newSort.level !== sort.level || newSort.columnName !== sort.columnName) {
            actions.setSort(newSort)
        }
    }

    const dragHandlers = useDrag(({ delta, data }) => {
        app.current.scrollLeft = data.x - delta.x
        app.current.scrollTop = data.y - delta.y
    }, () => ({ x: app.current.scrollLeft, y: app.current.scrollTop }))

    return (
        <Root {...props} {...dragHandlers}>
            <Table
                className={`table--${table}`}
                items={items.payload?.content ?? []}
                levels={levels}
                onSort={handleSort}
                defaultSort={sort}
                rowHeight={rowHeight}
                renderBody={body => (
                    <Async
                        data={[items, () => getter({ sort, filter, segment }), [sort, filter, segment, table]]}
                        success={() => body}
                        active={() => sort.column === undefined || sort.columnName} />
                )} />
                <Add>
                    <Tooltip render={() => <DatasetForm />} setCoords={addSetCoords}>
                        <AddButton onClick={() => null} />
                    </Tooltip>
                </Add>
        </Root>
    )

}

export default Database
