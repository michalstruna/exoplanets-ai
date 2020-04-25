import React from 'react'
import Styled from 'styled-components'
import { Color, Duration, size } from '../../Style'
import { IconButton } from '../../Layout'
import UsersRank from './UsersRank'
import OnlineUsers from './OnlineUsers'

interface Static {

}

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

interface NavLinkProps {
    isActive: boolean
}

const Root = Styled.div`
    ${size()}
`

const Nav = Styled.nav`
    ${size('100%', '2.5rem')}
    display: flex;
`

const NavLink = Styled(IconButton)<NavLinkProps>`
    flex: 1 1 0;
    transform: background-color ${Duration.MEDIUM}, opacity ${Duration.MEDIUM};
    
    ${props => props.isActive && `
        background-color: ${Color.MEDIUM_DARK};
        pointer-events: none;
        opacity: 1;
    `}
`

const Content = Styled.div`
    ${size('100%', 'calc(100% - 2.5rem)')}
`

const links = [
    { icon: 'Universe/RealTime/Volunteers.svg', text: 'Dobrovolníci' },
    { icon: 'Auth/Online.svg', text: 'Online (451)' },
    { icon: 'Universe/RealTime/Discussion.svg', text: 'Diskuse (2)' }
]

const tabs = [() => <UsersRank />, () => <OnlineUsers />, () => <div />]

const UsersBlock: React.FC<Props> & Static = ({ ...props }) => {

    const [tab, setTab] = React.useState(0)

    const renderedLinks = React.useMemo(() => (
        links.map((link, i) => (
            <NavLink onClick={() => setTab(i)} key={i} isActive={tab === i} icon={link.icon} isLarge={true}>
                {link.text}
            </NavLink>
        ))
    ), [tab])

    const renderedContent = React.useMemo(tabs[tab], [tab])

    return (
        <Root {...props}>
            <Nav>
                {renderedLinks}
            </Nav>
            <Content>
                {renderedContent}
            </Content>
        </Root>
    )

}

export default UsersBlock