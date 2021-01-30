import React from 'react'
import Styled from 'styled-components'

import { Color, size } from '../../Style'
import { HierarchicalTable, IconText } from '../../Layout'
import UserName from './UserName'
import { OnlineUser, useOnlineUsers, User } from '..'
import { useStrings } from '../../Data'
import { Dates } from '../../Native'
import { Format } from '../../Native/Utils/Dates'
import Countries from 'emoji-flags'

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

const Root = Styled.div`
    ${size()}
    background-color: ${Color.MEDIUM_DARK};
    overflow-x: hidden;
    overflow-y: auto;
`

const Empty = Styled.p`
    ${size('100%', '26rem')}
    align-items: center;
    font-style: italic;
    display: flex;
    justify-content: center;
    opacity: 0.5;
`

const OnlineUsers = ({ ...props }: Props) => {

    const users = useOnlineUsers()
    const globalStrings = useStrings()
    const strings = useStrings().users

    return (
        <Root {...props}>
            <HierarchicalTable
                withHeader={false}
                columns={[
                    {
                        accessor: (user: User) => user.name,
                        render: (name: string, user: User) => <UserName user={user} />,
                        width: 5
                    },
                    { accessor: (user: OnlineUser) => (
                        <IconText
                            icon={user.personal.sex && `User/${{F: 'Female', M: 'Male'}[user.personal.sex]}.svg`}
                            text={user.personal.birth ? Dates.formatDistance(globalStrings, user.personal.birth, undefined, Format.EXACT) : ''} />
                        ) },
                    { accessor: (user: OnlineUser) => {
                            const country = user.personal.country ? (Countries as any).countryCode(user.personal.country) : null
                            return country.emoji + ' ' + country.code
                        } },
                    { accessor: (user: OnlineUser) => {
                        return (
                            <>
                                <IconText icon='User/Source/Web.svg' title='Web' />
                                {user.clients?.map((_, i) => <IconText key={i} icon='User/Source/Client.svg' title='Client' />)}
                            </>
                        )
                        }, width: 3 },
                ]}
                items={users}
                renderBody={body => users.length > 0 ? body : <Empty>{strings.noOnlineUsers}</Empty>} />
        </Root>
    )

}

export default OnlineUsers