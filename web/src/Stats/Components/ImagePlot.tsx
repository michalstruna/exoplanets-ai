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
    log?: boolean
}

interface Props extends Omit<React.ComponentPropsWithoutRef<'div'>, 'title'> {
    data: PlotStat
    x?: Axis
    y?: Axis
    overlay?: React.ReactNode
}

const Root = Styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
`

const InnerRoot = Styled.div`
    ${size()}
    display: flex;
    position: relative;
    user-select: none;
    width: 100%;
    max-width: 45rem;
`

const Image = Styled.img`
    ${size()}
    pointer-events: none;
    position: relative;
`

const Vertical = Styled.div`
    display: flex;
    flex: 1 1 0;
    flex-direction: column;
    position: relative;
`

const Plot = Styled.div`
    flex-direction: column;
    position: relative;
`

const Tick = Styled.p`
    font-size: 70%;
`

const AxisLabel = Styled.p`
    font-size: 80%;
    font-weight: bold;
    text-align: center;
    white-space: nowrap;
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
    flex: 1 1 0;
    padding-right: 0.5rem;
    text-align: right;
    width: ${props => props.wide ? 3 : 2}rem;
    
    ${Ticks} {
        box-sizing: border-box;
        height: 100%;
    }
    
    ${AxisLabel} {
        position: relative;
        transform: rotate(-90deg) translateY(-260%);
        top: 50%;
        white-space: nowrap;
        width: 6rem;
    }
`

const XAxis = Styled.div`
    box-sizing: border-box;
    margin-top: 0.5rem;
    width: 100%;
    
    ${Ticks} {
        flex-direction: row;
        text-align: center;
    }
    
    ${Tick} {
        flex: 1 1 0;
        overflow: hidden;
    }
    
    ${AxisLabel} {
        flex: 1 1 0;
        margin-top: 0.3rem;
        width: 100%;
    }
`

const TinyVertical = Styled(Vertical)`
    display: inline-flex;
    flex: none;
    
    ${XAxis} {
        overflow: hidden;
        visibility: hidden;
        width: 1px;
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

const Overlay = Styled.div`
    ${size()}
    align-items: center;
    display: flex;
    font-size: 140%;
    justify-content: center;
    left: 0;
    position: absolute;
    text-align: center;
    top: 0;
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


const ImagePlot = ({ data, x, y, overlay, ...props }: Props) => {

    const xTicks = data.x.ticks || range(data.x.min!, data.x.max!, x?.nTicks ?? 8, data.x.log)
    const yTicks = data.y.ticks || range(data.y.max!, data.y.min!, y?.nTicks ?? 6, data.y.log)

    if (x) {
        x.log = data.x.log
    }

    if (y) {
        y.log = data.y.log
    }

    const renderTicks = (ticks: (number | string)[], axis?: Axis) => {
        const format = axis?.format ?? ((val: any) => val)

        return ticks.map((value, i) => (
            <Tick key={i}>
                {typeof value === 'number' ? format(axis?.log ? Numbers.toExponential(value) : value) : format(value)}
            </Tick>
        ))
    }

    const xAxis = x?.show !== false && (
        <XAxis>
            <Ticks>
                {renderTicks(xTicks, x)}
            </Ticks>
            {x?.label && <AxisLabel>{x.label}</AxisLabel>}
        </XAxis>
    )

    return (
        <Root {...props}>
            <InnerRoot>
                <TinyVertical>
                    {y?.show !== false && (
                        <YAxis wide={!!y?.label}>
                            {y?.label && <VerticalAxisLabel><AxisLabel>{y.label}</AxisLabel></VerticalAxisLabel>}
                            <Ticks>
                                {renderTicks(yTicks, y)}
                            </Ticks>
                        </YAxis>
                    )}
                    {xAxis}
                </TinyVertical>
                <Vertical>
                    <Plot>
                        {x?.show !== false && (
                            <VGrid>
                                {new Array(xTicks.length).fill(null).map((_, i) => <VLine key={i} />)}
                            </VGrid>
                        )}
                        {y?.show !== false && (
                            <HGrid>
                                {new Array(yTicks.length).fill(null).map((_, i) => <HLine key={i} />)}
                            </HGrid>
                        )}
                        <Image src={`http://localhost:5000/public/stats/${data.image}?t=${new Date().getTime()}`} />
                    </Plot>
                    {xAxis}
                </Vertical>
            </InnerRoot>
            {overlay && (
                <Overlay>
                    {overlay}
                </Overlay>
            )}
        </Root>
    )

}

ImagePlot.INT_TICK = (v: string | number) => Numbers.format(Math.round(parseInt(v as string)))

ImagePlot.Vertical = Vertical
ImagePlot.TinyVertical = TinyVertical

export default ImagePlot