import React from 'react'
import { LineChart, Line, YAxis, XAxis, ReferenceArea } from 'recharts'

interface Props extends React.ComponentPropsWithoutRef<'canvas'> {
    data: any
    width: number
    height: number
    color?: string
}

const initState = { left: 'dataMin', right: 'dataMax', refAreaLeft: '', refAreaRight: '', animation: false, top: 'dataMax', bottom: 'dataMin' }

const MiniGraph = ({ data, height, width, color }: Props) => {

    const [zoom, setZoom] = React.useState(initState)

    return React.useMemo(() => {
        if (!data) {
            return null // TODO: Error.
        }

        const values = data.map((value: any, i: number) => ({ value, i }))

        const getAxisYDomain = (from: any, to: any, ref: any) => {
            const refData = values.slice(from - 1, to)
            let [bottom, top] = [refData[0][ref], refData[0][ref]]

            refData.forEach( (d: any) => {
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
            setZoom({ ...zoom, refAreaLeft: '', refAreaRight: '', left: 'dataMin', right: 'dataMax', bottom: 'dataMin', top: 'dataMin' })
        }

        const renderLine = (name: string, color: string) => (
            <Line
                name={name}
                type='monotone'
                dataKey='value'
                stroke={color}
                strokeWidth={1}
                opacity={0.7}
                dot={false}
                isAnimationActive={zoom.animation}
                animationDuration={200} />
        )

        return (
            <div onDoubleClick={zoomOut} onMouseDown={e => e.stopPropagation()} onMouseMove={e => e.stopPropagation()}>
                <LineChart
                    data={values}
                    width={width}
                    height={height}
                    margin={{ left: 0, right: 0 }}
                    onMouseDown={e => e && setZoom({ ...zoom, refAreaLeft: e.activeLabel}) }
                    onMouseMove={e => e && zoom.refAreaLeft && setZoom({ ...zoom, refAreaRight: e.activeLabel}) }
                    onMouseUp={zoomIn}
                    onMouseEnter={() => setZoom({ ...zoom, animation: true })}
                    onMouseLeave={() => setZoom({ ...zoom, animation: false })}>
                    {renderLine('line', color || '#FAA')}

                    <XAxis
                        allowDataOverflow={true}
                        axisLine={false}
                        tickLine={false}
                        height={0}
                        dataKey='i'
                        type='number'
                        domain={[zoom.left, zoom.right]} />

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

                    {(zoom.refAreaLeft && zoom.refAreaRight) ? <ReferenceArea x1={zoom.refAreaLeft} x2={zoom.refAreaRight} strokeOpacity={0.3} /> : null}
                </LineChart>
            </div>
        )
    }, [data, zoom])
}

MiniGraph.defaultProps = {
    height: 80,
    width: 280
}

export default MiniGraph