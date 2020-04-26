import React from 'react'
import Styled from 'styled-components'

import { Color, size } from '../../Style'
import UserRole from '../Constants/UserRole'
import { Table } from '../../Layout'
import { UserSimple } from '../types'
import UserName from './UserName'

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
    
    ${Table.HeaderCell} {
        padding-bottom: 1rem;
        padding-top: 1rem;
    }
`

const users = [] as UserSimple[]

for (let i = 0; i < 38; i++) {
    users.push({
        id: 'abc' + i,
        avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Google_Earth_icon.svg/200px-Google_Earth_icon.svg.png',
        name: ('Michal Struna ' + i).repeat(Math.floor(Math.random() * 2 + 1)),
        role: UserRole.AUTHENTICATED,
        score: {
            rank: 193,
            totalPlanets: 213,
            totalStars: 512,
            time: 337
        },
        personal: {
            country: 'CZ',
            birth: 456,
            isMale: true
        },
        activity: {
            isOnline: true,
            last: new Date().getTime(),
            devices: {
                count: 3,
                power: 456781
            }
        }
    })
}


const OnlineUsers: React.FC<Props> & Static = ({ ...props }) => {

    const renderedTable = React.useMemo(() => (
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
            items={users} />
    ), [])

    return (
        <Root {...props}>
            {renderedTable}
        </Root>
    )

}

export default OnlineUsers