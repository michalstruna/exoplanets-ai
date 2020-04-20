import React from 'react'
import Styled, { css } from 'styled-components'

import { Dimension, size, image, opacityHover } from '../../Style'

interface Props extends React.ComponentPropsWithoutRef<'button'> {
    icon?: string
    isLarge?: boolean
    as?: string
}

export default Styled.button<Props>`
    ${opacityHover()}
    
    &:before {
        ${props => props.icon && image(props.icon, 'auto 100%', 'left center')}
        content: "";
        display: inline-block;
        margin-right: 0.5rem;
        vertical-align: middle;
    }
    
    ${props => props.isLarge ? css`
        ${size('auto', Dimension.NAV_HEIGHT, true)}
        
        &:before {
            ${size('1.2rem')}
        }
    ` : css`
        background-size: auto 1rem;
        
        &:before {
            ${size('1rem')}
        }
    `}
    
    ${props => props.as && `
        display: inline-block;
        opacity: 1;
    `}
`