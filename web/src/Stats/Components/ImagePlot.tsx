import React from 'react'
import Styled from 'styled-components'

import { Color, size } from '../../Style'
import { PlotStat } from '../types'
import { Numbers } from '../../Native'

type TickFormatter = (tick: string | number) => React.ReactNode

interface Axis {
    show?: boolean
    label?: string
    nTicks?: number
    format?: TickFormatter
}

interface Props extends Omit<React.ComponentPropsWithoutRef<'canvas'>, 'title'> {
    data: PlotStat
    x?: Axis
    y?: Axis
}

const Root = Styled.div`
    display: flex;
    flex-direction: column;
`

const InnerRoot = Styled.div`
    ${size()}
    align-items: stretch;
    display: flex;
    position: relative;
    user-select: none;
    width: 100%;
    max-width: 45rem;
`

const Image = Styled.img`
    pointer-events: none;
    width: 100%;
`

const Vertical = Styled.div`
    display: flex;
    flex: 1 1 0;
    flex-direction: column;
    position: relative;
`

const Plot = Styled.div`
    position: relative;
`

const Tick = Styled.p`
    font-size: 70%;
`

const AxisLabel = Styled.p`
    font-size: 80%;
    font-weight: bold;
    text-align: center;
`

const VerticalAxisLabel = Styled.div`
    ${size('1rem', '100%')}
    float: left;
    position: relative;
`

const Ticks = Styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`

interface YAxisProps {
    wide?: boolean
}

const YAxis = Styled.div<YAxisProps>`
    padding-right: 0.5rem;
    text-align: right;
    width: ${props => props.wide ? 3 : 2}rem;
    
    ${Ticks} {
        box-sizing: border-box;
        height: calc(100% - 1.2rem);
        padding-bottom: 1.5rem;
    }
    
    ${AxisLabel} {
        position: relative;
        transform: rotate(-90deg) translateY(-50%);
        top: 50%;
        white-space: nowrap;
    }
`

const XAxis = Styled.div`
    box-sizing: border-box;
    margin-top: 0.5rem;
    width: 100%;
    
    ${Ticks} {
        flex-direction: row;
    } 
    
    ${Tick} {
        width: 1.5rem;
    }
    
    ${AxisLabel} {
        flex: 1 1 0;
        margin-top: 0.3rem;
        width: 100%;
    }
`

const HGrid = Styled.div`
    ${size()}
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    left: 0;
    opacity: 0.2;
    position: absolute;
    top: 0;
`

const HLine = Styled.div`
    ${size('100%', '1px')}
    background-color: ${Color.LIGHTEST};
`

const VGrid = Styled(HGrid)`
    flex-direction: row;
`

const VLine = Styled.div`
    ${size('1px', '100%')}
    background-color: ${Color.LIGHTEST};
`

const Title = Styled.p`
    font-weight: bold;
    margin-bottom: 0.5rem;
    text-align: center;
`

const range = (min: number, max: number, count: number, log: boolean = false): number[] => {
    const result = []

    if (log) {
        if (min > max) {
            for (let i = min; i >= max; i /= 10) {
                result.push(i)
            }
        } else {
            for (let i = min; i <= max; i *= 10) {
                result.push(i)
            }
        }
    } else {
        const step = Math.round((max - min) / (count - 1) * 10000) / 10000

        for (let i = 0; i < count; i++) {
            result.push(Math.round((min + (i * step)) * 10000) / 10000)
        }
    }

    return result
}

const ImagePlot = ({ data, x, y, ...props }: Props) => {

    const xTicks = data.x.ticks || range(data.x.min!, data.x.max!, x?.nTicks ?? 8, data.x.log)
    const yTicks = data.y.ticks || range(data.y.max!, data.y.min!, y?.nTicks ?? 6, data.y.log)

    const renderTicks = (ticks: (number | string)[], formatter: TickFormatter = val => val) => {
        const minLength = ticks[0].toString().length
        const maxLength = ticks[ticks.length - 1].toString().length
        const isLog = Math.abs(maxLength - minLength) > 1

        return ticks.map((value, i) => (
            <Tick key={i}>
                {formatter(isLog ? Numbers.toExponential(value as number) : Numbers.format(value as number))}
            </Tick>
        ))
    }

    return (
        <Root>
            <InnerRoot>
                {y?.show !== false && (
                    <YAxis wide={!!y?.label}>
                        {y?.label && <VerticalAxisLabel><AxisLabel>{y.label}</AxisLabel></VerticalAxisLabel>}
                        <Ticks>
                            {renderTicks(yTicks, y?.format)}
                        </Ticks>
                    </YAxis>
                )}
                <Vertical>
                    <Plot>
                        {y?.show !== false && (
                            <HGrid>
                                {new Array(yTicks.length).fill(null).map((_, i) => <HLine key={i} />)}
                            </HGrid>
                        )}
                        {x?.show !== false && (
                            <VGrid>
                                {new Array(xTicks.length).fill(null).map((_, i) => <VLine key={i} />)}
                            </VGrid>
                        )}
                        <Image src={`http://localhost:5000/public/stats/${data.image}`} />
                    </Plot>
                    {x?.show !== false && (
                        <XAxis>
                            <Ticks>
                                {renderTicks(xTicks)}
                            </Ticks>
                            {x?.label && <AxisLabel>{x.label}</AxisLabel>}
                        </XAxis>
                    )}
                </Vertical>
            </InnerRoot>
        </Root>
    )

}

ImagePlot.INT_TICK = (v: string | number) => Math.round(parseInt(v as string))

export default ImagePlot