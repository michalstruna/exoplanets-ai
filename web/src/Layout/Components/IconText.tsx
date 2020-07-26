import React from 'react'
import Styled, { css } from 'styled-components'

import { Color, image, opacityHover, size } from '../../Style'
import { Link, Target } from '../../Routing'

interface Props extends React.ComponentPropsWithoutRef<'div'>, Partial<Target> {
    icon?: string
    text?: React.ReactNode
    size?: string
    isActive?: boolean
    value?: React.ReactNode
}

interface RootProps {
    isActive?: boolean
    isButton?: boolean
    isSmall?: boolean
}

interface IconProps {
    size: string
}

const RootLink = Styled(Link)`
    ${size()}
    ${opacityHover()}
    overflow: hidden;
    text-overflow: ellipsis;
    
    &${Link.ACTIVE} {
        background-color: ${Color.MEDIUM_DARK};
        pointer-events: none;
        opacity: 1;
    }
`

const Root = Styled.div<RootProps>`
    ${size()}
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    
    ${props => props.isButton && css`
        ${opacityHover()}
    `}
    
        
    ${props => props.isActive && `
        background-color: ${Color.MEDIUM_DARK};
        pointer-events: none;
        opacity: 1;
    `}
    
    ${props => props.isSmall && `
        font-size: 90%;
    `}
`

const Icon = Styled.div<IconProps>`
    ${props => size(props.size)}
    ${image(undefined)}
    display: inline-block;
    margin-right: 0.5rem;
    vertical-align: middle;
`

const Text = Styled.div`
    display: inline-block;
    vertical-align: middle;
`

const Value = Styled.div`
    font-weight: bold;
`

const IconText = ({ icon, text, value, size, isActive, pathname, query, hash, ...props }: Props) => {

    if (pathname || query || hash) {
        return (
            <RootLink {...props as any} pathname={pathname} query={query} hash={hash}>
                <Icon
                    style={{ backgroundImage: icon && `url(${/^http|^\//.test(icon) ? icon : '/img/' + icon})` }}
                    size={size || IconText.MEDIUM} />
                {text}
            </RootLink>
        )
    }

    return (
        <Root {...props as any} isButton={!!props.onClick} isActive={isActive} isSmall={!!value} as={!!props.onClick ? 'button' : undefined}>
            <Icon
                style={{ backgroundImage: icon && `url(${/^http|^\//.test(icon) ? icon : '/img/' + icon})` }}
                size={size || IconText.MEDIUM} />
                <Text>
                    {text}
                    {value && <Value>{value}</Value>}
                </Text>
        </Root>
    )

}

IconText.SMALL = '1rem'
IconText.MEDIUM = '1.35rem'
IconText.LARGE = '2.5rem'

export default IconText