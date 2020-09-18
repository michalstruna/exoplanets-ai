import React from 'react'
import Styled from 'styled-components'
import { CartesianGrid, Line, LineChart, ReferenceArea, XAxis, YAxis } from 'recharts'

interface Props extends React.ComponentPropsWithoutRef<'canvas'> {
    data: number[]
    simple?: boolean
    color?: string
}

const Root = Styled.div`
    user-select: none;
`

const initState = {
    left: 'dataMin',
    right: 'dataMax',
    refAreaLeft: '',
    refAreaRight: '',
    animation: false,
    top: 'dataMax',
    bottom: 'dataMin'
}

const Curve = ({ data, simple, color, ...props }: Props) => {

    const [zoom, setZoom] = React.useState(initState)

    return React.useMemo(() => {
        if (!data) {
            return null // TODO: Error.
        }

        const values = data.map((value, i) => ({ value, i }))
        const [width, height] = simple ? [280, 80] : [390, 200]

        const getAxisYDomain = (from: any, to: any, ref: any) => {
            const refData = values.slice(from - 1, to) as any
            let [bottom, top] = [refData[0][ref], refData[0][ref]]

            refData.forEach((d: any) => {
                if (d[ref] > top) top = d[ref]
                if (d[ref] < bottom) bottom = d[ref]
            })

            return [bottom, top]
        }

        const zoomIn = () => {
            if (zoom.refAreaLeft === zoom.refAreaRight || zoom.refAreaRight === '') {
                setZoom({ ...zoom, refAreaLeft: '', refAreaRight: '' })
                return
            }

            let { refAreaLeft, refAreaRight } = zoom

            if (zoom.refAreaLeft > zoom.refAreaRight) {
                [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft]
            }

            const [bottom, top] = getAxisYDomain(refAreaLeft, refAreaRight, 'value')

            setZoom({ ...zoom, refAreaLeft: '', refAreaRight: '', left: refAreaLeft, right: refAreaRight, bottom, top })
        }

        const zoomOut = () => {
            setZoom({
                ...zoom,
                refAreaLeft: '',
                refAreaRight: '',
                left: 'dataMin',
                right: 'dataMax',
                bottom: 'dataMin',
                top: 'dataMin'
            })
        }

        return (
            <Root onDoubleClick={zoomOut} onMouseDown={e => e.stopPropagation()} onMouseMove={e => e.stopPropagation()}>
                <LineChart
                    data={values}
                    width={width}
                    height={height}
                    margin={{ left: 0, right: 0 }}
                    onMouseDown={e => e && setZoom({ ...zoom, refAreaLeft: e.activeLabel })}
                    onMouseMove={e => e && zoom.refAreaLeft && setZoom({ ...zoom, refAreaRight: e.activeLabel })}
                    onMouseUp={zoomIn}
                    onMouseEnter={() => setZoom({ ...zoom, animation: true })}
                    onMouseLeave={() => setZoom({ ...zoom, animation: false })}>

                    <Line
                        type='monotone'
                        dataKey='value'
                        stroke={color}
                        strokeWidth={1}
                        dot={{ fill: color, opacity: 0.5 }}
                        isAnimationActive={zoom.animation}
                        animationDuration={100} />

                    {simple ? null : <CartesianGrid opacity={0.2} />}

                    {simple ? (
                        <XAxis
                            allowDataOverflow={true}
                            axisLine={false}
                            tickLine={false}
                            height={0}
                            dataKey='i'
                            type='number'
                            domain={[zoom.left, zoom.right]} />
                    ) : (
                        <XAxis
                            allowDataOverflow={true}
                            axisLine={false}
                            dataKey='i'
                            type='number'
                            domain={[zoom.left, zoom.right]}
                            tick={{ fill: color || '#FAA', fontSize: 13 }} />
                    )}

                    <YAxis
                        allowDataOverflow={true}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={x => Math.round(x * 10000) / 10000}
                        type='number'
                        tickCount={10}
                        interval={'preserveStart'}
                        domain={[zoom.bottom, zoom.top]}
                        tick={{ fill: color || '#FAA', fontSize: 13 }}
                        minTickGap={40} />

                    {(zoom.refAreaLeft && zoom.refAreaRight) ?
                        <ReferenceArea x1={zoom.refAreaLeft} x2={zoom.refAreaRight} strokeOpacity={0.3} /> : null}
                </LineChart>
            </Root>
        )
    }, [data, simple, color, zoom])

}

export default Curve