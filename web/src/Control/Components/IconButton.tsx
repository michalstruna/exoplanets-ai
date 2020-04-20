import React from 'react'
import Styled, { css } from 'styled-components'

import { Dimension, Mixins } from '../../Style'

interface Props extends React.ComponentPropsWithoutRef<'button'> {
    icon?: string
    isLarge?: boolean
    as?: string
}

export default Styled.button<Props>`
    ${Mixins.OpacityHover()}
    
    &:before {
        ${props => props.icon && Mixins.Image(props.icon, 'auto 100%', 'left center')}
        content: "";
        display: inline-block;
        margin-right: 0.5rem;
        vertical-align: middle;
    }
    
    ${props => props.isLarge ? css`
        ${Mixins.Size('auto', Dimension.NAV_HEIGHT, true)}
        
        &:before {
            ${Mixins.Size('1.2rem')}
        }
    ` : css`
        background-size: auto 1rem;
        
        &:before {
            ${Mixins.Size('1rem')}
        }
    `}
    
    ${props => props.as && `
        display: inline-block;
        opacity: 1;
    `}
`