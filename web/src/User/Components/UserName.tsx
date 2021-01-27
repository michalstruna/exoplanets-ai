import React from 'react'
import Styled from 'styled-components'

import { User } from '../types'
import UserPreview from './UserPreview'
import Tooltip from '../../Layout/Components/Tooltip'
import { IconText } from '../../Layout'
import Avatar from './Avatar'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    user: User
}

const Root = Styled(IconText)`
    cursor: pointer;
    opacity: 0.8;
    text-align: left;
    max-width: 100%;
    
    ${IconText.Text} {
        text-overflow: ellipsis;
        overflow: hidden;
    }
`

const UserName = ({ user, ...props }: Props) => {

    return (
        <Tooltip render={() => <UserPreview user={user} />}>
            <Root {...props} icon={Avatar.getUrl(user.avatar)} text={user.name} onClick={() => null} />
        </Tooltip>
    )

}

export default UserName