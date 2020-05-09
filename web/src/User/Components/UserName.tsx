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

const Root = Styled(Tooltip)`
    cursor: default;
    max-width: 100%;
`

const UserName: React.FC<Props> & Static = ({ user, ...props }) => {

    return (
        <Root {...props} renderContent={() => <UserPreview user={user} />}>
            <IconText icon={user.avatar} text={user.name} />
        </Root>
    )

}

export default UserName