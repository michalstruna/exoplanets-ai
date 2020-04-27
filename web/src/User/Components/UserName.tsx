import React from 'react'
import Styled from 'styled-components'

import { UserSimple } from '../types'
import UserPreview from './UserPreview'
import Tooltip from '../../Layout/Components/Tooltip'
import { IconText } from '../../Layout'

interface Static {

}

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    user: UserSimple
}

const Root = Styled(IconText)`
    cursor: pointer;
    opacity: 0.8;
    text-align: left;
    max-width: 100%;
`

const UserName: React.FC<Props> & Static = ({ user, ...props }) => {

    return (
        <Tooltip render={() => <UserPreview user={user} />}>
            <Root {...props} icon={user.avatar} text={user.name} onClick={() => null} />
        </Tooltip>
    )

}

export default UserName