import React from 'react'
import Styled from 'styled-components'
import { User } from '../types'
import { flexCenter, size } from '../../Style'
import Sex from '../Constants/Sex'
import { Config } from '../../Async'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    user?: User
    src?: string
    size: string
}

interface RootProps {
    size: string
}

const Root = Styled.div<RootProps>`
    ${props => size(props.size)}
    ${flexCenter()}
    border-radius: ${props => props.size};
    overflow: hidden;
`

const Image = Styled.img`
    width: 100%;
    max-height: 100%;
    max-width: 100%;
`

const Avatar = ({ user, src, size, ...props }: Props) => {
    let url = user?.avatar ?? src!

    if (!url) {
        const sex = user!.personal.sex === Sex.FEMALE ? 'Female' : 'Male'
        url = `/img/User/Avatar/${sex}.svg`
    } else if (!url.includes('http')) {
        url = Avatar.getUrl(url)
    }

    return (
        <Root {...props} size={size}>
            <Image src={url} />
        </Root>
    )
}

Avatar.getUrl = (name?: string): string => (name ? `${Config.serverUrl}/public/avatar/${name}` : '')

Avatar.Root = Root
Avatar.Image = Image

export default Avatar
