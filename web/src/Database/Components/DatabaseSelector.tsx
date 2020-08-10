import React from 'react'
import Styled from 'styled-components'

import { useFixedX } from '../../Style'
import { Paginator, Filter, useActions, useStrings } from '../../Data'
import { setSegment, setFilter } from '../Redux/Slice'
import { useCursor, useItems, useTable } from '..'
import DbTable from '../Constants/DbTable'
import { provideFilterColumns } from '../Utils/StructureProvider'
import { Urls } from '../../Routing'
import { Field, FieldType, Form } from '../../Form'

interface Props extends React.ComponentPropsWithRef<'div'> {

}

const Root = Styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    max-width: calc(100% - 2rem);
    
    & > * {
        width: 33.33%;
    }
`

const Select = Styled(Form)`
    min-width: 10rem;
    
    select {
        width: 100%;
        max-width: 10rem;
    }
`

const FilterForm = Styled(Filter)`
    margin: 1.5rem 1rem;
    min-width: 35rem;
`

const Page = Styled(Paginator)`
    widthh: 28rem;
    min-width: 28rem;
`

const DatabaseSelector = ({ ...props }: Props) => {

    const { segment, filter } = useCursor()
    const actions = useActions({ setSegment, setFilter })

    const root = React.useRef()
    useFixedX(root as any)

    const table = useTable()
    const items = useItems(table)

    const strings = useStrings()

    const filterColumns = React.useMemo(() => provideFilterColumns(table, strings).map(x => ({ text: x[1], value: x[0], values: x[2] })), [table])

    return (
        <Root {...props} ref={root as any}>
            <Select onSubmit={() => null} defaultValues={{ table }}>
                <Field
                    name='table'
                    type={FieldType.SELECT}
                    onChange={e => Urls.replace({ pathname: e.target.value })}
                    label={strings.database.select}
                    options={Object.values(DbTable).map(table => ({ text: strings.database.tables[table], value: table }))} />
            </Select>
            <FilterForm
                attributes={filterColumns}
                onChange={() => null}
                onSubmit={actions.setFilter} />
            <Page
                page={segment}
                itemsCount={items.payload ? items.payload.count : 0}
                onChange={actions.setSegment}
                freeze={items.pending} />
        </Root>
    )

}

export default DatabaseSelector