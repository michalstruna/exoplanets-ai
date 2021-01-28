import React from 'react'
import Styled from 'styled-components'

import { Color, Duration, image, opacityHover, size } from '../../Style'
import { Diff, HierarchicalTable, MinorSectionTitle } from '../../Layout'
import { getUsers, useIdentity, User, useUsers, getUserRank } from '..'
import { Link, Url } from '../../Routing'
import UserName from './UserName'
import { Async } from '../../Async'
import { Paginator, Sort, Units, UnitType, UnitTypeData, useStrings } from '../../Data'
import { AggregatedStats } from '../../Stats'
import DbTable from '../../Database/Constants/DbTable'
import { useSelector } from 'react-redux'

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

interface NavLinkProps {
    isActive?: boolean
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
    
    & > *:last-child {
        &, button {
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

const Unauth = Styled.p`
    font-size: 90%;
    font-style: italic;
    font-weight: normal !important;
    line-height: 2.3rem;
    opacity: 0.5;
    text-align: center;
`

const PAGE_SIZE = 10
const ranks: [string, UnitTypeData][] = [['planets', UnitType.SCALAR], ['items', UnitType.SCALAR], ['data', UnitType.MEMORY], ['time', UnitType.TIME]]

const UsersRank = ({ ...props }: Props) => {

    const users = useUsers()
    const strings = useStrings().users
    const identity = useIdentity()
    const { userRank } = useSelector<any, any>(state => state.user)

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

    const sort = [{ columnName: rank[0] + sortSuffix, isAsc: false, level: 0 }, { columnName: 'name', isAsc: true, level: 0 }]

    const usersGetter = React.useCallback(() => (
        getUsers({ segment: { index: page, size: PAGE_SIZE }, sort })
    ), [rank, sortSuffix, page])

    const userRankGetter = React.useCallback(() => (
        getUserRank([identity.payload?._id, sort])
    ), [identity])

    const items = React.useMemo(() => {
        const result = [...(users.payload?.content || [])]

        if (identity.payload && userRank.payload) {
            result.push({ ...identity.payload, rank: userRank.payload.value })
        }

        return result
    }, [users, identity, userRank])

    return (
        <Root {...props}>
            <Title>
                {strings.volunteersRank}
                <DetailLink pathname={Url.DATABASE + '/' + DbTable.USERS} />
            </Title>
            <Inner>
                <UsersTable
                    items={items}
                    withHeader={false}
                    rowHeight={() => 37.8}
                    columns={[
                        {
                            accessor: (user, i: number) => ((user.rank ?? (i + 1)) + '.'),
                            width: '1rem',
                            render: (v, user) => user && v
                        },
                        {
                            accessor: (user: User) => user.name,
                            render: (name, user) => <UserName user={user} />,
                            width: 2
                        },
                        {
                            accessor: (user: User) => user.stats[rank[0] as keyof AggregatedStats],
                            width: 1.2,
                            render: (v, user) => <Diff {...v} format={v => Units.format(v, rank[1])} />
                        },
                    ]}
                    renderBody={body => (
                        <Async
                            data={[
                                [users, usersGetter, [usersGetter]],
                                [userRank, userRankGetter, [userRankGetter]]
                            ]}
                            success={() => (
                                <>
                                    {body}
                                    {!identity.payload && <Unauth>{strings.unauth}</Unauth>}
                                </>
                            )} />
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
                </Nav>
            </Inner>
        </Root>
    )

}

export default UsersRank