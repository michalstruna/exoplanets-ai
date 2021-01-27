import React from 'react'
import Styled from 'styled-components'

import { Paginator, Filter, useActions, useStrings } from '../../Data'
import { setSegment, setFilter } from '../Redux/Slice'
import { useCursor, useFilterFields, useItems, useTable } from '..'
import DbTable from '../Constants/DbTable'
import { Urls } from '../../Routing'
import { Field, FieldType, Form } from '../../Form'

interface Props extends React.ComponentPropsWithRef<'div'> {

}

const Root = Styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    overflow: hidden;
    max-width: calc(100% - 2rem);
    
    & > * {
        width: 33.33%;
    }
    
    position: sticky;
    left: 1rem;
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

`

const DatabaseSelector = ({ ...props }: Props) => {

    const { segment } = useCursor()
    const actions = useActions({ setSegment, setFilter })

    const table = useTable()
    const items = useItems(table)

    const strings = useStrings()
    const filterFields = useFilterFields()

    return (
        <Root {...props}>
            <Select onSubmit={() => null} defaultValues={{ table }}>
                <Field
                    name='table'
                    type={FieldType.SELECT}
                    onChange={e => Urls.replace({ pathname: e.target.value })}
                    label={strings.database.select}
                    options={Object.values(DbTable).map(table => ({ text: strings.database.tables[table], value: table }))} />
            </Select>
            <FilterForm
                attributes={filterFields}
                groupAttributes={table === DbTable.BODIES ? (attr => attr.value.toString().startsWith('planet_') ? 'Planety' : 'Hvězdy') : undefined}
                onChange={() => null}
                onSubmit={actions.setFilter} />
            <Page
                page={segment!}
                itemsCount={items.payload ? items.payload.count : 0}
                onChange={actions.setSegment}
                freeze={items.pending} />
        </Root>
    )

}

export default DatabaseSelector