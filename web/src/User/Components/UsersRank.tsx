import React from 'react'
import Styled from 'styled-components'

import { Color, Duration, image, opacityHover, size } from '../../Style'
import { Diff, HierarchicalTable, MinorSectionTitle } from '../../Layout'
import { getUsers, useIdentity, User, useUsers } from '..'
import { Link, Url } from '../../Routing'
import UserName from './UserName'
import { Async } from '../../Async'
import { Paginator, Units, UnitType, UnitTypeData, useStrings } from '../../Data'
import { AggregatedStats } from '../../Stats'
import DbTable from '../../Database/Constants/DbTable'
import Auth from './Auth'
import UserRole from '../Constants/UserRole'

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

interface NavLinkProps {
    isActive: boolean
}

const Root = Styled.div`
    ${size()}
    display: flex;
    flex-direction: column;
`

const Title = Styled(MinorSectionTitle)`
    background-color: ${Color.MEDIUM_DARK};
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 0;
    padding: 1rem;
    
    select {
        font-size: 80%;
        padding-bottom: 0.5rem;
        padding-top: 0;
    }
`

const Inner = Styled.div`
    ${size()}
    display: flex;
    overflow: hidden;
`

const Nav = Styled.nav`
    ${size('8rem', '100%')}
    display: flex;
    flex-direction: column;
`

const NavLink = Styled.button<NavLinkProps>`
    ${opacityHover()}
    ${size()}
    box-sizing: border-box;
    padding: 0.5rem;
    text-align: left;
    transition: background-color ${Duration.MEDIUM}, opacity ${Duration.MEDIUM};
    
    ${props => props.isActive && `
        background-color: ${Color.MEDIUM_DARK};
        opacity: 1;
        pointer-events: none;
    `}
`

const NavMenu = Styled.div`
    background-color: ${Color.MEDIUM_DARK};
    box-sizing: border-box;
    padding: 0 0.5rem;
    width: 100%;

    select {
        height: 3.5rem;
        margin-bottom: 1rem;
        width: 100%;
        white-space: normal;
    }

    ${Paginator.Row} {
        margin-bottom: 2rem;
        padding: 0;

        li {
            min-width: 2.3rem;
        }

        ul {
            text-align: center;
        }
    }
`

const UsersTable = Styled(HierarchicalTable)`
    ${size('calc(100% - 8rem)', '100%')}
    background-color: ${Color.MEDIUM_DARK};
    position: relative;

    ${HierarchicalTable.Cell} {
        background-color: transparent !important;
    }
    
    ${HierarchicalTable.Row} {
        &:last-of-type {
            font-weight: bold;
        }
    }
`

const DetailLink = Styled(Link)`
    ${size('1.5rem')}
    ${image('Controls/ArrowRight.svg', '90%')}
    ${opacityHover()}
    vertical-align: middle;
`

const PAGE_SIZE = 10
const ranks: [string, UnitTypeData][] = [['planets', UnitType.SCALAR], ['items', UnitType.SCALAR], ['data', UnitType.MEMORY], ['time', UnitType.TIME]]

const UsersRank = ({ ...props }: Props) => {

    const users = useUsers()
    const strings = useStrings().users
    const identity = useIdentity()

    const [rank, setRank] = React.useState(ranks[0])
    const [page, setPage] = React.useState(0)
    const [sortSuffix, setSortSuffix] = React.useState('_diff')

    const renderedLinks = React.useMemo(() => (
        ranks.map((r, i) => (
            <NavLink key={i} onClick={() => setRank(ranks[i])} isActive={r === rank}>
                {strings[r[0]]}
            </NavLink>
        ))
    ), [rank])

    const usersGetter = React.useCallback(() => (
        getUsers({ segment: { index: page, size: PAGE_SIZE }, sort: { columnName: rank[0] + sortSuffix, isAsc: false, level: 0 } })
    ), [rank, sortSuffix, page])

    return (
        <Root {...props}>
            <Title>
                {strings.volunteersRank}
                <DetailLink pathname={Url.DATABASE + '/' + DbTable.USERS} />
            </Title>
            <Inner>
                <UsersTable
                    items={users.payload?.content || []}
                    withHeader={false}
                    columns={[
                        { accessor: (user, i: number) => (i + 1) + '.', width: '1rem' },
                        {
                            accessor: (user: User) => user.name,
                            render: (name, user) => <UserName user={user} />,
                            width: 2
                        },
                        {
                            accessor: (user: User) => user.stats[rank[0] as keyof AggregatedStats],
                            width: 1.2,
                            render: v => <Diff {...v} format={v => Units.format(v, rank[1])} />
                        },
                    ]}
                    renderBody={body => (
                        <Async data={[users, usersGetter, [usersGetter]]} success={() => body} />
                    )} />
                <Nav>
                    <NavMenu>
                        <select onChange={e => setSortSuffix(e.target.value)}>
                            <option value='_diff'>{strings.lastWeek}</option>
                            <option value=''>{strings.total}</option>
                        </select>
                        <Paginator
                            page={{ index: page, size: PAGE_SIZE }}
                            onChange={segment => setPage(segment.index)}
                            itemsCount={users.payload?.count || 0}
                            freeze={users.pending}
                            surrounding={false} />
                    </NavMenu>
                    {renderedLinks}
                    <Auth
                        role={UserRole.UNAUTHENTICATED}
                        when={() => (
                            null
                        )}
                        otherwise={() => (
                            null
                        )}
                    />
                </Nav>
            </Inner>
        </Root>
    )

}

export default UsersRank