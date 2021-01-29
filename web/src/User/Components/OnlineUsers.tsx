import React from 'react'
import Styled from 'styled-components'

import { Color, size } from '../../Style'
import { HierarchicalTable } from '../../Layout'
import UserName from './UserName'
import { useOnlineUsers, User } from '..'

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

const Root = Styled.div`
    ${size()}
    background-color: ${Color.MEDIUM_DARK};
    overflow-x: hidden;
    overflow-y: auto;

    ${HierarchicalTable.Header} ${HierarchicalTable.Cell} {
        background-color: transparent;
        font-weight: bold;
    }
`

const OnlineUsers = ({ ...props }: Props) => {

    const users = useOnlineUsers()

    return (
        <Root {...props}>
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
        </Root>
    )

}

export default OnlineUsers