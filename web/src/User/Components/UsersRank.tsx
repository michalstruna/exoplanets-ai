import React from 'react'
import Styled from 'styled-components'

import { Color, Duration, size, image, opacityHover } from '../../Style'
import { MinorSectionTitle, Table } from '../../Layout'
import UserRole from '../Constants/UserRole'
import { useIdentity } from '..'
import { Link, Url } from '../../Routing'
import UserName from './UserName'

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
    background: ${Color.MEDIUM_DARK};
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
    overflow: hidden;
`

const Nav = Styled.nav`
    ${size('8rem', '100%')}
    display: flex;
    flex-direction: column;
    float: left;
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

const UsersTable = Styled(Table)`
    ${size('calc(100% - 8rem)', '100%')}
    background: ${Color.MEDIUM_DARK};
    float: left;

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

const links = ['Objevené planety', 'Prozkoumané hvězdy', 'Výpočetní čas', 'Výpočetní čas', 'Objevené planety', 'Výpočetní čas']

const data = {
    list: [], me: {
        value: Math.round(Math.random() * 5000),
        change: Math.round(Math.random() * 500)
    }
} as any

for (let i = 0; i < 11; i++) {
    data.list.push({
        value: Math.round(Math.random() * 5000),
        change: Math.round(Math.random() * 500),
        user: {
            id: 'abc' + i,
            avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Google_Earth_icon.svg/200px-Google_Earth_icon.svg.png',
            name: ('Michal Struna ' + i).repeat(Math.floor(Math.random() * 2 + 1)),
            role: UserRole.AUTHENTICATED,
            stats: {
                planets: { value: 0, diff: 0 },
                items: { value: 0, diff: 0 },
                time: { value: 0, diff: 0 },
                data: { value: 0, diff: 0 }
            },
            personal: {
                country: 'CZ',
                birth: 456,
                male: true
            }
        }
    })
}


const columns = [
    { accessor: (user: any, index: any) => (user.position || (index + 1)) + '.' },
    {
        accessor: (user: any) => user.user.name,
        render: (name: any, user: any) => <UserName user={user.user} />,
        width: 6
    },
    { accessor: (user: any) => user.value, width: 2 },
    { accessor: (user: any) => user.change, render: (change: any) => change > 0 ? change : '', width: 2 }
]


const UsersRank = ({ ...props }: Props) => {

    const [rank, setRank] = React.useState(0)
    const identity = useIdentity()

    const renderedLinks = React.useMemo(() => (
        links.map((link, i) => (
            <NavLink key={i} onClick={() => setRank(i)} isActive={i === rank}>
                {link}
            </NavLink>
        ))
    ), [rank])

    const users = React.useMemo(() => {
        const result = [...data.list]

        if (identity.payload) {
            result.push({ ...data.me, user: identity.payload })
        }

        return result
    }, [identity])

    return (
        <Root {...props}>
            <Title>
                Žebříček dobrovolníků
                <select>
                    <option>Za poslední den</option>
                    <option>Za poslední týden</option>
                    <option>Za poslední měsíc</option>
                    <option>Za poslední rok</option>
                    <option>Celkem</option>
                </select>
                <DetailLink pathname={Url.DATABASE} />
            </Title>
            <Inner>
                <UsersTable items={users} columns={columns} withHeader={false} />
                <Nav>
                    {renderedLinks}
                </Nav>
            </Inner>
        </Root>
    )

}

export default UsersRank