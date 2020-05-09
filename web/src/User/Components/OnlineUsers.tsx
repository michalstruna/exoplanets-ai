import React from 'react'
import Styled from 'styled-components'

import { Color, size } from '../../Style'
import UserRole from '../Constants/UserRole'
import { Table } from '../../Layout'
import { UserSimple } from '../types'
import UserName from './UserName'
import { useOnlineUsers } from '..'

interface Static {

}

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

const OnlineUsers: React.FC<Props> & Static = ({ ...props }) => {

    const users = useOnlineUsers()

    const renderedTable = React.useMemo(() => users.payload && (
        <Table
            columns={[
                { accessor: user => user.score.rank, title: 'Rank', render: rank => rank + '.' },
                {
                    accessor: user => user.name, title: 'Jméno',
                    render: (name, user) => <UserName user={user} />,
                    width: 5
                },
                { accessor: user => user.activity.devices.power, title: 'Výkon', width: 2 }
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