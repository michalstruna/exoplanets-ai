import React from 'react'
import Styled, { css } from 'styled-components'

import { Color, dots, image, opacityHover, size } from '../../Style'
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

const rootStyle = css`
    ${size()}
    display: inline-block;
    white-space: nowrap;
`

const RootLink = Styled(Link)`
    ${opacityHover()}
    ${rootStyle}
    
    &${Link.ACTIVE} {
        background-color: ${Color.MEDIUM_DARK};
        pointer-events: none;
        opacity: 1;
    }
`

const Root = Styled.div<RootProps>`
    ${rootStyle}
    
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
    ${image(undefined)}
    ${props => size(props.size, '100%')}
    display: inline-block;
    margin-right: 0.5rem;
    vertical-align: middle;
    min-height: ${props => props.size};
`

const Text = Styled.div`
    ${dots()}
`

const Value = Styled.div`
    ${dots()}
    font-weight: bold;
`

const Right = Styled.div<IconProps>`
    align-items: flex-start;
    display: inline-flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    overflow: hidden;
    vertical-align: middle;
    max-width: calc(100% - 0.5rem - ${props => props.size})
`

const IconText = ({ icon, text, value, size, isActive, pathname, query, hash, ...props }: Props) => {

    const inner = (
        <>
            <Icon
                style={{ backgroundImage: icon && `url(${/^http|^\//.test(icon) ? icon : '/img/' + icon})` }}
                size={size || IconText.SMALL} />
            <Right size={size || IconText.SMALL}> 
                <Text>{text}</Text>
                {value && <Value>{value}</Value>}
            </Right>
        </>
    )


    if (pathname || query || hash) {
        return (
            <RootLink {...props as any} pathname={pathname} query={query} hash={hash}>
                {inner}
            </RootLink>
        )
    }

    return (
        <Root type='button' {...props as any} isButton={!!props.onClick} isActive={isActive} isSmall={!!value} as={!!props.onClick ? 'button' : undefined}>
            {inner}
        </Root>
    )

}

IconText.SMALL = '1.35rem'
IconText.MEDIUM = '1.88rem'
IconText.LARGE = '2.5rem'

IconText.Root = Root + ', ' + RootLink
IconText.Text = Text
IconText.Value = Value
IconText.Icon = Icon

export default IconText