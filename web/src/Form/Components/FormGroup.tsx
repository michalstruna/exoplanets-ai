import React from 'react'
import Styled from 'styled-components'
import Field from './Field'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    nColumns?: number
}

const Root = Styled.div`
    align-items: center;
    border-bottom: 2px dashed rgba(255, 255, 255, 0.1);
    display: flex;
    padding: 0.5rem 1rem;
    padding-top: 0.5rem;
    
    & + button {
        margin-top: 0 !important;
    }
    
    &:not(:first-of-child) {
        border-top: 2px dashed rgba(255, 255, 255, 0.1);
    }
    
    &:last-child {
        border-bottom: none;
    }
    
    ${Field.Root} {
        margin: 0.5rem 0;
    }
`

const Title = Styled.p`
    font-size: 90%;
    margin-right: 1rem;
    opacity: 0.5;
    transform: rotateY(180deg) rotateX(180deg);
    white-space: nowrap;
    writing-mode: tb-rl;
`

interface InnerProps {
    nColumns: number
}

const Inner = Styled.div<InnerProps>`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;

    & > * {
        min-height: 1px;
        flex: 0 0 calc(100% / ${props => props.nColumns} - 0.5rem);
    }
`

const FormGroup = ({ children, title, nColumns, ...props }: Props) => {

    return (
        <Root {...props}>
            <Title>
                {title}
            </Title>
            <Inner nColumns={nColumns!}>
                {children}
            </Inner>
        </Root>
    )

}

export default FormGroup

FormGroup.defaultProps = {
    nColumns: 3
}