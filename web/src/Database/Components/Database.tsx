import React from 'react'
import Styled from 'styled-components'

import { useActions, useStrings } from '../../Data'
import { useDrag, useElement } from '../../Native'
import { ZIndex, size } from '../../Style'
import { HierarchicalTable } from '../../Layout'
import {
    useBodies,
    getBodies,
    useBodiesFilter,
    useBodiesSort,
    setBodiesSort,
    useBodiesSegment,
    useTable,
    useDatasets,
    getDatasets
} from '..'
import { Async } from '../../Async'
import DbTable from '../Constants/DbTable'
import { providedStructure } from '../Utils/StructureProvider'

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
    }
    
    &.table--${DbTable.DATASETS} ${HierarchicalTable.Cell} {
        &:first-of-type {
            width: 3rem;
        }
    }
    
    &.table--${DbTable.STARS_AND_PLANETS} { 
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
            &:nth-of-type(2) {
                padding-right: 0;
                position: relative;
                text-align: right;
                z-index: ${ZIndex.TABLE_BODY_ICON};
                min-width: 0;
            }
        
            &:nth-of-type(3) {
                border-right: 2px solid black;
                left: 0;
                position: sticky;
                z-index: ${ZIndex.TABLE_BODY_NAME};
            }
            
            &:nth-of-type(11) {            
                &:not([data-header])[data-level="0"] {
                    padding-left: 0;
                    padding-right: 0;
                }
            }
            
            &[data-level="0"] {
                &:nth-of-type(2) {
                    width: 5rem;
                }
            }
            
            &[data-level="1"] {
                &:nth-of-type(2) {
                    padding-left: 3rem;
                }
                
                &:nth-of-type(3) {
                    margin-left: -2rem;
                    padding-left: 3rem;
                }
            }
            
            &[data-header] {
                height: 3rem;
                padding-top: 0;
                padding-bottom: 0;
            
                &[data-level="0"] {                            
                    .image--star {
                        ${size('2.5rem')}
                    }
                    
                    &:first-of-type {
                        font-size: 110%;
                        transform: translateY(30%);
                    }
                }
                
                &[data-level="1"] {
                    height: 2rem;
                
                    .image--star {
                        ${size('1.5rem')}
                    }
                }
            }
        }
    }
`

const Database = ({ ...props }: Props) => {

    const bodies = useBodies()
    const datasets = useDatasets()

    const filter = useBodiesFilter()
    const sort = useBodiesSort()
    const actions = useActions({ getBodies, setBodiesSort, getDatasets })
    const table = useTable()

    const segment = useBodiesSegment()
    const { app } = useElement()
    const strings = useStrings().database

    const { levels, rowHeight } = React.useMemo(() => providedStructure(table, strings), [table, strings])


    const dragHandlers = useDrag(({ delta, data }) => {
        app.current.scrollLeft = data.x - delta.x
        app.current.scrollTop = data.y - delta.y
    }, () => ({ x: app.current.scrollLeft, y: app.current.scrollTop }))

    const handleSort = (newSort: any) => {
        if (newSort.column !== sort.column || newSort.isAsc !== sort.isAsc || newSort.level !== sort.level) {
            actions.setBodiesSort(newSort)
        }
    }

    const { items, getter } = React.useMemo(() => {
        if (table === DbTable.DATASETS) {
            return { items: datasets, getter: getDatasets }
        } else {
            return { items: bodies, getter: getBodies }
        }
    }, [table, bodies, datasets])

    return (
        <Root {...props} {...dragHandlers}>
            <Table
                className={`table--${table}`}
                items={items.payload?.content ?? []}
                levels={levels as any}
                onSort={handleSort}
                defaultSort={sort}
                rowHeight={rowHeight}
                renderBody={body => (
                    <Async
                        data={[items, () => getter({ sort, filter, segment }), [sort, filter, segment, table]]}
                        success={() => body} />
                )} />
        </Root>
    )

}

export default Database