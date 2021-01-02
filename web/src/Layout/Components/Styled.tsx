import Styled from 'styled-components'

import { Color, Duration, image, opacityHover, size } from '../../Style'

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
    padding: 0.8rem 0;
    width: 100%;
    white-space: nowrap;
`

export const PrimaryButton = Styled.button`
    background-color: ${Color.DARKEST};
    font-size: 110%;
    font-weight: bold;
    overflow: hidden;
    padding: 1rem;
    transition: background-color ${Duration.MEDIUM};
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
    
    &:hover {
        background-color: ${Color.DARKEST_HOVER};
    }
`

export const MiniPrimaryButton = Styled(PrimaryButton)`
    font-size: 90%;
    margin 0 !important;
    padding: 0.5rem !important;
    width: auto !important;
`

export const SubmitButton = Styled.button`
    ${image('Controls/Submit.svg', '2rem auto', 'right center')}
    ${opacityHover()}
    ${size('auto !important', '2.5rem', true)}
    background-color: transparent;
    padding-right: 2.5rem;
    white-space: nowrap;
`

export const ControlTitle = Styled(SectionTitle)`
    text-align: center;
`

export const ControlSubtitle = Styled(MinorSectionTitle)`
    font-size: 105%;
`

export const SecondaryButton = Styled.button`
    ${opacityHover()}
    border-bottom: 1px solid transparent;
    font-size: 90%;
`