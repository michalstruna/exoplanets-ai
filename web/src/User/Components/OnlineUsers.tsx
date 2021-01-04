import React from 'react'
import Styled from 'styled-components'

import { Color, size } from '../../Style'
import { Table } from '../../Layout'
import UserName from './UserName'
import { useOnlineUsers } from '..'

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

const Root = Styled.div`
    ${size()}
    background-color: ${Color.MEDIUM_DARK};
    overflow-x: hidden;
    overflow-y: auto;
    
    & > ${Table.Root} {
        height: auto;
        width: 100%;
    }
    
    ${Table.Cell} {
        padding: 0 0.5rem;
        
        & > * {
            padding: 0.5rem 0;
        }
    }
    
    ${Table.HeaderCell} {
        padding-bottom: 1rem;
        padding-top: 1rem;
    }
`

const OnlineUsers = ({ ...props }: Props) => {

    const users = useOnlineUsers()

    const renderedTable = React.useMemo(() => users.payload && (
        <Table
            columns={[
                { accessor: user => user.stats.planets, title: 'Rank', render: rank => rank + '.' },
                {
                    accessor: user => user.name, title: 'Jméno',
                    render: (name, user) => <UserName user={user} />,
                    width: 5
                },
                { accessor: user => 5/*user.activity.devices.power*/, title: 'Výkon', width: 2 }
            ]}
            items={users.payload} />
    ), [])

    return (
        <Root {...props}>
            {renderedTable}
        </Root>
    )

}

export default OnlineUsers