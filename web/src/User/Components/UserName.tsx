import React from 'react'
import Styled from 'styled-components'
import { UserSimple } from '../types'
import { image, size } from '../../Style'
import UserPreview from './UserPreview'
import Tooltip from '../../Layout/Components/Tooltip'

interface Static {

}

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    user: UserSimple
}

const Root = Styled(Tooltip)`
    cursor: default;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
`

const Avatar = Styled.div`
    ${size('1.35rem')}
    ${image(undefined)}
    display: inline-block;
    margin-right: 0.5rem;
    vertical-align: middle;
`

const UserName: React.FC<Props> & Static = ({ user, ...props }) => {

    return (
        <Root {...props} renderContent={() => <UserPreview user={user} />}>
            <Avatar style={{ backgroundImage: user.avatar && `url(${user.avatar})` }} />
            {user.name}
        </Root>
    )

}

export default UserName