import React from 'react'
import Styled from 'styled-components'

import { UserSimple } from '../types'
import UserPreview from './UserPreview'
import Tooltip from '../../Layout/Components/Tooltip'
import { IconText, setTooltip } from '../../Layout'
import { useActions } from '../../Data'

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

    const id = React.useMemo(() => new Date().getTime() + Math.random(), [])

    const actions = useActions({ setTooltip })

    const handleClick = (event: React.MouseEvent) => {
        event.stopPropagation()

        Tooltip.Area.instances[id] = {
            coords: { x: event.pageX, y: event.pageY },
            render: () => <UserPreview user={user} />
        }

        actions.setTooltip(id)
    }

    return (
        <Root
            icon={user.avatar}
            text={user.name}
            onClick={handleClick} />
    )

}

export default UserName