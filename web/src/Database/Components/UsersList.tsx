import React from 'react'
import Styled from 'styled-components'

import { Color, Duration, Mixin } from '../../Utils'
import { MinorSectionTitle, Table } from '../../Layout'
import UserRole from '../../Auth/Constants/UserRole'
import { useIdentity } from '../../Auth'
import { Link, Url } from '../../Routing'

interface Static {

}

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

interface NavLinkProps {
    isActive: boolean
}

const Root = Styled.div`
    ${Mixin.Size()}
    background-color: ${Color.DARK};
    display: flex;
    flex-direction: column;
`

const Title = Styled(MinorSectionTitle)`
    background: ${Color.MEDIUM_DARK};
    align-items: center;
    display: flex;
    justify-content: space-between;
    
    select {
        font-size: 80%;
        padding-bottom: 0.5rem;
        padding-top: 0;
    }
`

const Inner = Styled.div`
    ${Mixin.Size()}
    display: flex;
`

const Content = Styled.main`
    ${Mixin.Size('calc(100% - 5rem)', '100%')}
    background: ${Color.MEDIUM_DARK};
`

const Nav = Styled.nav`
    ${Mixin.Size('8rem', '100%')}
    display: flex;
    flex-direction: column;
`

const NavLink = Styled.button<NavLinkProps>`
    ${Mixin.Size()}
    box-sizing: border-box;
    padding: 0.5rem;
    text-align: left;
    word-spacing: 9999999px;
    transition: color ${Duration.MEDIUM};
    
    &:hover {
        background-color: ${Color.MEDIUM_DARK};
    }
    
    ${props => props.isActive && `
        background-color: ${Color.MEDIUM_DARK};
        pointer-events: none;
    `}
`

const UsersTable = Styled(Table)`
    ${Table.Cell} {
        &:first-of-type {
            width: 1rem;
        }
        
        &:nth-of-type(2) {
            width: 100%;
            max-width: 0;
        }
        
        &:nth-of-type(3) {
            width: 3rem;
        }
        
        &:nth-of-type(4) {
            color: ${Color.GREEN};
            font-size: 90%;
            
            &:not(:empty):before {
                content: "+";
            }
        }
    }
    
    ${Table.Row} {
        &:last-of-type {
            font-weight: bold;
        }
    }
`

const Image = Styled.div`
    ${Mixin.Size('1.35rem')}
    ${Mixin.Image(undefined)}
    display: inline-block;
    margin-right: 0.5rem;
    vertical-align: middle;
`

const DetailLink = Styled(Link)`
    ${Mixin.Size('1.5rem')}
    ${Mixin.Image('Controls/ArrowRight.svg', '90%')}
    ${Mixin.OpacityHover()}
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
            score: {
                rank: 193,
                totalPlanets: { value: 3, rank: 216 },
                totalStars: { value: 314, rank: 512 },
                time: { value: 7875, rank: 337 }
            },
            personal: {
                country: 'CZ',
                birth: 456,
                isMale: true
            }
        }
    })
}


const columns = [
    { accessor: (user: any, index: any) => (user.position || (index + 1)) + '.' },
    {
        accessor: (user: any) => user.user.name,
        render: (name: any, user: any) => <><Image
            style={{ backgroundImage: user.user.avatar && `url(${user.user.avatar})` }} />{name}</>
    },
    { accessor: (user: any) => user.value },
    { accessor: (user: any) => user.change, render: (change: any) => change > 0 ? change : '' }
]


const UsersList: React.FC<Props> & Static = ({ ...props }) => {

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
    }, [identity, data])

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
                <Content>
                    <UsersTable items={users} columns={columns} withHeader={false} />
                </Content>
                <Nav>
                    {renderedLinks}
                </Nav>
            </Inner>
        </Root>
    )

}

export default UsersList