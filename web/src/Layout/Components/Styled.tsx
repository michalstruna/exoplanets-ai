import Styled from 'styled-components'

import { Color, Duration } from '../../Style'

export const PageTitle = Styled.h1`
    font-size: 180%;
    margin-bottom: 1rem;
`

export const SectionTitle = Styled.h2`
    font-size: 150%;
    padding: 1rem 0;
`

export const MinorSectionTitle = Styled.h3`
    box-sizing: border-box;
    font-size: 120%;
    font-weight: bold;
    margin: 0;
    padding: 1rem 0;
    width: 100%;
    white-space: nowrap;
`

export const PrimaryButton = Styled.button`
    background-color: ${Color.DARKEST};
    font-size: 110%;
    font-weight: bold;
    padding: 1rem;
    transition: background-color ${Duration.MEDIUM};
    width: 100%;
    
    &:hover {
        background-color: ${Color.DARKEST_HOVER};
    }
`