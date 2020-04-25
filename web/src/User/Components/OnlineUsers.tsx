import React from 'react'
import Styled from 'styled-components'

import { Color, image, size } from '../../Style'
import UserRole from '../Constants/UserRole'
import { Table } from '../../Layout'
import { UserSimple } from '../types'

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
    
    ${Table.HeaderRow} {
        height: 3rem;
    }
    
    ${Table.Cell} {
        &:first-of-type {
            max-width: 10rem;
        }
    }
`

const Image = Styled.div`
    ${size('1.35rem')}
    ${image(undefined)}
    display: inline-block;
    margin-right: 0.5rem;
    vertical-align: middle;
`

const users = [] as UserSimple[]

for (let i = 0; i < 100; i++) {
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
                {
                    accessor: user => user.name, title: 'Jméno',
                    render: (name, user) => <><Image
                        style={{ backgroundImage: user.avatar && `url(${user.avatar})` }} />{name}</>
                },
                { accessor: user => user.score.rank, title: 'Rank' },
                { accessor: user => user.activity.devices.power, title: 'Výkon' }
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