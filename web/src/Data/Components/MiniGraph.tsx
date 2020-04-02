import React from 'react'
import Styled from 'styled-components'
import { LineChart, Line, YAxis, Legend, ResponsiveContainer } from 'recharts'

interface Static {

}

interface Props extends React.ComponentPropsWithoutRef<'canvas'> {
    data: any
    width: number
    height: number
    lines: string[]
    labels?: string[]
}

const Root = Styled.canvas`

`

const LegendItem = Styled.span`
    display: inline-block;
    font-size: 80%;
    margin-top: 0.25rem;
`

const MiniGraph: React.FC<Props> & Static = ({ data, lines, labels, ...props }) => {

    const renderYAxis = (orientation: string = 'left', color: string) => (
        <YAxis
            axisLine={false}
            tickLine={false}
            type='number'
            tickCount={10}
            interval={'preserveStartEnd'}
            domain={['dataMin', 'dataMax']}
            yAxisId={orientation}
            tick={{ fill: color, fontSize: 13 }}
            orientation={orientation as 'left' | 'right'} />
    )

    const renderLine = (name, key, color, axisId) => (
        <Line
            name={name}
            type='monotone'
            dataKey={key}
            stroke={color}
            strokeWidth={2}
            opacity={0.7}
            dot={false}
            yAxisId={axisId}
            isAnimationActive={false} />
    )

    const withLeft = data && data[0][lines[0]]

    return React.useMemo(() => (
        <LineChart data={data} width={320} height={80}>
            {renderLine(labels[0] || lines[0], lines[0], '#77CC77', withLeft ? 'left' : 'right')}
            {renderYAxis(withLeft ? 'left' : 'right', '#77CC77')}
            {renderLine(labels[1] || lines[1], lines[1], '#CC7777', withLeft ? 'right' : 'left')}
            {renderYAxis(withLeft ? 'right' : 'left', '#CC7777')}
        </LineChart>
    ), [data, lines])
}

MiniGraph.defaultProps = {
    labels: []
}

export default MiniGraph