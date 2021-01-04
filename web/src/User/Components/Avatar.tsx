import React from 'react'
import Styled from 'styled-components'
import { User } from '../types'
import { flexCenter, size } from '../../Style'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    user: User
    size: string
}

interface RootProps {
    size: string
}

const Root = Styled.div<RootProps>`
    ${props => size(props.size)}
    ${flexCenter()}
`

const Image = Styled.img`
    max-height: 100%;
    max-width: 100%;
`

const Avatar = ({ user, size, ...props }: Props) => {

    let url = user.avatar

    if (!url) {
        const sex = user.personal.male === false ? 'Female' : 'Male'
        url = `/img/User/Avatar/${sex}.svg`
    }

    return (
        <Root {...props} size={size}>
            <Image src={url} />
        </Root>
    )

}

Avatar.Root = Root
Avatar.Image = Image

export default Avatar