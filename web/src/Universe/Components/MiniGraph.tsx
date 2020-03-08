import React from 'react'
import Styled from 'styled-components'
import { LineChart, Line, YAxis, Legend, ResponsiveContainer } from 'recharts'

interface Static {

}

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    data: any
    left: string
    right: string
}

const LegendItem = Styled.span`
    display: inline-block;
    font-size: 80%;
    margin-top: 0.25rem;
`

const MiniGraph: React.FC<Props> & Static = ({ data, left, right, ...props }) => {

    const items = data[left].map((item, i) => ({ [left]: data[left][i], [right]: data[right][i] }))

    const renderYAxis = (orientation: 'left' | 'right' = 'left', color: string) => (
        <YAxis
            type='number'
            domain={['dataMin', 'dataMax']}
            yAxisId={orientation}
            tick={{ fill: color, fontSize: 13 }}
            orientation={orientation} />
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
            yAxisId={axisId} />
    )

    return (
        <ResponsiveContainer width='100%' height='100%'>
            <LineChart data={items}>
                {renderLine('Tranzit [%]', left, '#77CC77', 'left')}
                {renderYAxis('left', '#77CC77')}
                {renderLine('Radiální rychlost [m/s]', right, '#CC7777', 'right')}
                {renderYAxis('right', '#AA5555')}
                <YAxis type='number' domain={['dataMin', 'dataMax']} yAxisId='right' orientation='right' />
                <Legend formatter={(value, entry) => <LegendItem style={{ color: entry.color }}>{value}</LegendItem>} />
            </LineChart>
        </ResponsiveContainer>
    )

}

export default MiniGraph