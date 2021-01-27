import React from 'react'
import Styled from 'styled-components'

import { Color, Duration, image, opacityHover, size } from '../../Style'
import { Diff, HierarchicalTable, MinorSectionTitle, Table } from '../../Layout'
import { getUsers, useUsers, User } from '..'
import { Link, Url } from '../../Routing'
import UserName from './UserName'
import { Async } from '../../Async'
import { Units, UnitType, UnitTypeData, useStrings } from '../../Data'

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
    word-spacing: 9999999px;
    
    ${props => props.isActive && `
        background-color: ${Color.MEDIUM_DARK};
        opacity: 1;
        pointer-events: none;
    `}
`

const UsersTable = Styled(HierarchicalTable)`
    ${size('calc(100% - 8rem)', '100%')}
    background-color: ${Color.MEDIUM_DARK};
    position: relative;

    ${Table.Cell} {
        padding: 0 0.5rem;
            
        &:nth-of-type(4) {
            color: ${Color.GREEN};
            font-size: 90%;
            
            &:not(:empty):before {
                content: "+";
            }
        }
        
        & > * {
            padding: 0.5rem 0;
        }
    }
    
    ${Table.Row} {
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

    const [rank, setRank] = React.useState(ranks[0])

    const renderedLinks = React.useMemo(() => (
        ranks.map((r, i) => (
            <NavLink key={i} onClick={() => setRank(ranks[i])} isActive={r === rank}>
                {strings[r[0]]}
            </NavLink>
        ))
    ), [rank])

    const usersGetter = React.useCallback(() => (
        getUsers({ segment: { index: 0, size: PAGE_SIZE }, sort: { columnName: 'items_diff', isAsc: false, level: 0 } })
    ), [])

    return (
        <Root {...props}>
            <Title>
                Žebříček dobrovolníků
                <select>
                    <option>Poslední týden</option>
                    <option>Celkem</option>
                </select>
                <DetailLink pathname={Url.DATABASE} />
            </Title>
            <Inner>
                <Async data={[users, usersGetter]} success={() => (
                    <UsersTable
                        items={users.payload!.content}
                        withHeader={false}
                        columns={[
                            { accessor: (user, i: number) => (i + 1) + '.', width: '1rem' },
                            {
                                accessor: (user: User) => user.name,
                                render: (name, user) => <UserName user={user} />,
                                width: 2
                            },
                            {
                                accessor: (user: User) => user.stats.items,
                                width: 1,
                                render: v => <Diff {...v} format={v => Units.format(v, rank[1])} />
                            },
                        ]} />
                )} />
                <Nav>
                    {renderedLinks}
                </Nav>
            </Inner>
        </Root>
    )

}

export default UsersRank