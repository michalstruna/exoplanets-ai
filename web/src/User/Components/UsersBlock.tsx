import React from 'react'
import Styled from 'styled-components'
import { Duration, size } from '../../Style'
import { IconText } from '../../Layout'
import UsersRank from './UsersRank'
import OnlineUsers from './OnlineUsers'
import Chat from './Chat'
import { useOnlineUsers } from '../Redux/Selectors'
import { useStrings } from '../../Data'

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

const tabs = [() => <UsersRank />, () => <OnlineUsers />, () => <Chat />]

const UsersBlock = ({ ...props }: Props) => {

    const [tab, setTab] = React.useState(0)
    const onlineUsers = useOnlineUsers()
    const strings = useStrings().users

    const links = [
        { icon: 'Database/RealTime/Volunteers.svg', text: strings.volunteers },
        { icon: 'Controls/Active.svg', text: `Online (${onlineUsers.length})` },
        { icon: 'Database/RealTime/Discussion.svg', text: strings.discussion }
    ]

    const renderedLinks = React.useMemo(() => (
        links.map((link, i) => (
            <NavLink
                onClick={() => setTab(i)}
                key={i}
                isActive={tab === i}
                icon={link.icon}
                text={link.text} />
        ))
    ), [tab, onlineUsers])

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