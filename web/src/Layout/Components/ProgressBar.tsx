import React from 'react'
import Styled from 'styled-components'
import { Color, size } from '../../Style'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    range: number | [number, number]
    value: number | number[]
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
    position: relative;
`

const Inner = Styled.div`
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
`

const colors = [Color.GREEN, Color.DARK_GREEN]

const ProgressBar = ({ range, value, label, ...props }: Props) => {

    const values = Array.isArray(value) ? value : [value]

    const min = Array.isArray(range) ? range[0] : 0
    const max = Array.isArray(range) ? range[1] : range

    const percentages = values.map(value => Math.round(10000 * value / (max - min)) / 100)

    return (
        <Root {...props}>
            <Header>
                <div>{percentages[0]} %</div>
                <div>{label}</div>
            </Header>
            <Outer>
                {percentages.map((percentage, i) => (
                    <Inner style={{ width: `${percentage}%`, backgroundColor: colors[i % colors.length] }} key={i} />
                ))}
            </Outer>
        </Root>
    )

}

export default ProgressBar