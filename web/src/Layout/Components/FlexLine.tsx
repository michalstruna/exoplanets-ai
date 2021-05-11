import React from 'react'
import Styled from 'styled-components'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    reverse?: boolean
}

const FlexLine = Styled.div<Props>`
    align-items: center;
    display: flex;
    justify-content: flex-start;
    overflow: hidden;
    margin: 0 -0.5rem;
    padding: 1rem 0;

    & > * {
        margin: 0 0.5rem;
    }

    ${props => props.reverse && `
        flex-direction: row-reverse;
        justify-content: flex-end;
    `}
`

export default FlexLine