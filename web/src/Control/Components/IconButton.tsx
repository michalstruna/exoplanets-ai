import React from 'react'
import Styled, { css } from 'styled-components'
import { Dimensions, Mixin } from '../../Utils'

interface Props extends React.ComponentPropsWithoutRef<'button'> {
    icon?: string
    isLarge?: boolean
    as?: string
}

export default Styled.button<Props>`
    ${Mixin.OpacityHover()}
    
    &:before {
        ${props => props.icon && Mixin.Image(props.icon, 'auto 100%', 'left center')}
        content: "";
        display: inline-block;
        margin-right: 0.5rem;
        vertical-align: middle;
    }
    
    ${props => props.isLarge ? css`
        ${Mixin.Size('auto', Dimensions.NAV_HEIGHT, true)}
        
        &:before {
            ${Mixin.Size('1.2rem')}
        }
    ` : css`
        background-size: auto 1rem;
        
        &:before {
            ${Mixin.Size('1rem')}
        }
    `}
    
    ${props => props.as && `
        display: inline-block;
        opacity: 1;
    `}
`