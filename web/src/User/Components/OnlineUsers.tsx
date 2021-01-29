import React from 'react'
import Styled from 'styled-components'

import { Color, size } from '../../Style'
import { HierarchicalTable, Table } from '../../Layout'
import UserName from './UserName'
import { useOnlineUsers, User } from '..'

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

    const renderedTable = React.useMemo(() => (
        <HierarchicalTable
            columns={[
                {
                    accessor: (user: User) => user.name, title: 'Jméno',
                    render: (name: string, user: User) => <UserName user={user} />,
                    width: 5
                },
                { accessor: (user: User) => 5/*user.activity.devices.power*/, title: 'Výkon', width: 2 }
            ]}
            items={users} />
    ), [])

    return (
        <Root {...props}>
            {renderedTable}
        </Root>
    )

}

export default OnlineUsers