import React from 'react'
import Styled from 'styled-components'

import { User } from '../types'
import UserPreview from './UserPreview'
import Tooltip from '../../Layout/Components/Tooltip'
import { IconText } from '../../Layout'
import Avatar from './Avatar'
import { image, size } from '../../Style'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    user: User
    text?: React.ReactNode
    value?: React.ReactNode
    size?: string
}

const Root = Styled(IconText)`
    cursor: pointer;
    opacity: 0.8;
    position: relative;
    text-align: left;
    max-width: 100%;
    
    ${IconText.Text} {
        text-overflow: ellipsis;
        overflow: hidden;
    }

    ${IconText.Icon} {
        border-radius: ${props => props.size};
        position: relative;

        &:after {
            ${size('0.5rem')}
            ${image()}
            border-radius: 100%;
            content: "";
            display: block;
            left: 100%;
            position: absolute;
            transform: translateX(-100%) translateY(-100%);
            top: 100%;
        }
    }
`

const UserName = ({ user, ...props }: Props) => {
    return (
        <Tooltip render={() => <UserPreview user={user} />}>
            <Root
                text={user.name}
                size={IconText.MEDIUM}
                {...props}
                icon={Avatar.getUrl(user.avatar)}
                onClick={() => null} />
        </Tooltip>
    )
}

export default UserName
