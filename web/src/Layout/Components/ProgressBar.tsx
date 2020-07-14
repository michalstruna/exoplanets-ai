import React from 'react'
import Styled from 'styled-components'
import { Color, size } from '../../Style'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    range: number | [number, number]
    value: number
    label?: React.ReactNode
}

const Root = Styled.div`
    width: 100%;
`

const Header = Styled.div`
    display: flex;
    font-size: 90%;
    justify-content: space-between;
    margin-bottom: 0.5rem;
`

const Outer = Styled.div`
    ${size('100%', '0.6rem')}
    background-color: ${Color.DARK};
    border: 1px solid ${Color.MEDIUM};
    box-sizing: border-box;
`

const Inner = Styled.div`
    background-color: ${Color.DARK_GREEN};
    height: 100%;
`

const ProgressBar = ({ range, value, label, ...props }: Props) => {

    const min = Array.isArray(range) ? range[0] : 0
    const max = Array.isArray(range) ? range[1] : range

    const percentage = Math.round(100 * value / (max - min))

    return (
        <Root {...props}>
            <Header>
                <div>{percentage} %</div>
                <div>{label}</div>
            </Header>
            <Outer>
                <Inner style={{ width: `${percentage}%` }} />
            </Outer>
        </Root>
    )

}

export default ProgressBar