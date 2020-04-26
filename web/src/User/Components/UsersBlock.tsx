import React from 'react'
import Styled from 'styled-components'
import { Duration, size } from '../../Style'
import { IconText } from '../../Layout'
import UsersRank from './UsersRank'
import OnlineUsers from './OnlineUsers'

interface Static {

}

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

const Root = Styled.div`
    ${size()}
`

const Nav = Styled.nav`
    ${size('100%', '2.5rem')}
    display: flex;
`

const NavLink = Styled(IconText)`
    flex: 1 1 0;
    transition: background-color ${Duration.MEDIUM}, opacity ${Duration.MEDIUM};
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
            <NavLink
                onClick={() => setTab(i)}
                key={i}
                isActive={tab === i}
                icon={link.icon}
                text={link.text} />
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