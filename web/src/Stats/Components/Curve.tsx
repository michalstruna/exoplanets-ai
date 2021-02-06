import React from 'react'
import Styled from 'styled-components'
import { Config } from '../../Async'
import { LightCurve } from '../../Database/types'
import { Color, size } from '../../Style'

interface Props extends Omit<React.ComponentPropsWithoutRef<'canvas'>, 'title'> {
    data: LightCurve
    simple?: boolean
    type: string
    title?: React.ReactNode
}

const Root = Styled.div`
    display: flex;
    flex-direction: column;
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
    pointer-events: none;
    width: 100%;
`

const Vertical = Styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    width: calc(100% - 2.5rem);
`

const Plot = Styled.div`
    position: relative;
`

const Tick = Styled.p`
    font-size: 70%;
`

const YAxis = Styled.div`
    align-self: stretch;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 3rem;
`

const XAxis = Styled(YAxis)`
    box-sizing: border-box;
    flex-direction: row;
    margin-top: 0.5rem;
    width: 100%;
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

const range = (min: number, max: number, count: number): number[] => {
    const step = Math.round((max - min) / (count - 1) * 10000) / 10000
    const result = []

    for (let i = 0; i < count; i++) {
        result.push(Math.round((min + (i * step)) * 10000) / 10000)
    }

    return result
}

const Curve = ({ data, simple, type, title, ...props }: Props) => {

    return (
        <Root>
            {title && (
                <Title>
                    {title}
                </Title>
            )}
            <InnerRoot>
                <YAxis style={simple ? undefined : { paddingBottom: '1rem' }}>
                    {range(data.max_flux, data.min_flux, simple ? 3 : 6).map((flux, i) => (
                        <Tick key={i}>{flux}</Tick>
                    ))}
                </YAxis>
                <Vertical>
                    <Plot>
                        <HGrid>
                            {simple ? null : new Array(simple ? 3 : 6).fill(null).map((_, i) => <HLine key={i} />)}
                        </HGrid>
                        <VGrid>
                            {simple ? null : new Array(simple ? 4 : 10).fill(null).map((_, i) => <VLine key={i} />)}
                        </VGrid>
                        <Image src={`${Config.serverUrl}/public/${type}/${data.plot}`} />
                    </Plot>
                    {!simple && (
                        <XAxis>
                            {range(data.min_time ?? -0.5, data.max_time ?? 0.5, simple ? 4 : 10).map((time, i) => (
                                <Tick key={i}>{Math.round(time * 10) / 10}</Tick>
                            ))}
                        </XAxis>
                    )}
                </Vertical>
            </InnerRoot>
        </Root>
    )

}

Curve.LV = 'lv'
Curve.GV = 'gv'
Curve.LC = 'lc'
Curve.STATS = 'stats'

export default Curve