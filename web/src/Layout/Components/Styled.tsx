import Styled from 'styled-components'

import { Color, opacityHover } from '../../Style'

export const PageTitle = Styled.h1`
    font-size: 150%;
`

export const MinorSectionTitle = Styled.h2`
    box-sizing: border-box;
    font-size: 110%;
    font-weight: bold;
    margin: 0;
    padding: 1rem;
    width: 100%;
    white-space: nowrap;
`

export const PrimaryButton = Styled.button`
    ${opacityHover()}
    background-color: ${Color.DARKEST};
    font-size: 110%;
    font-weight: bold;
    padding: 1rem;
    width: 100%;
`