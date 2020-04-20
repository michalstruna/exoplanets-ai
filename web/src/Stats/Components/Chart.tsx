import React from 'react'
import Styled from 'styled-components'
import {
    Bar, BarChart,
    CartesianGrid,
    Legend, Line, LineChart, Pie, PieChart, Radar, RadarChart, ResponsiveContainer,
    Scatter, ScatterChart,
    Tooltip,
    XAxis,
    YAxis,
    ZAxis
} from 'recharts'

import { Numbers } from '../../Native'
import { Color } from '../../Style'

enum ChartType {
    LINE,
    BAR,
    SCATTER,
    PIE,
    RADAR
}

const mapTypeToComponent: Record<ChartType, { component: typeof React.Component, chart: typeof React.Component }> = {
    [ChartType.LINE]: { component: Line, chart: LineChart },
    [ChartType.BAR]: { component: Bar, chart: BarChart },
    [ChartType.SCATTER]: { component: Scatter, chart: ScatterChart },
    [ChartType.PIE]: { component: Pie, chart: PieChart },
    [ChartType.RADAR]: { component: Radar, chart: RadarChart }
}

interface Static {
    Type: typeof ChartType
}

interface Dimension {
    name: string
    title?: string
    log?: boolean
    min?: string | number
    max?: string | number
}

interface ExtraDimension {
    name: string
    colors?: string[]
}

interface Props<T> {
    type: ChartType
    items: T[]
    x: Dimension
    y?: Dimension
    z?: ExtraDimension
    color?: string
    axisColor?: string
    textColor?: string
    grid?: boolean
    width?: string | number
    height?: string | number
}

const Root = Styled(ResponsiveContainer)`
     font-size: 85%;

    .recharts {
    
        &-label {

        }
    
        &-legend {
            &-wrapper {
                padding-left: 2rem;
                max-width: 5.5rem;
            }
        
            &-item {
                margin: 0.5rem 0;
            
                svg {
                    margin-left: -1rem;
                }
            
                &-text {
    
                }
            }
        }
    } 
`

const splitIntoCategories = <T extends any>(items: T[], key: string): Record<string, T[]> => {
    const result = {} as any

    for (const item of items) {
        if (!result[item[key]]) {
            result[item[key]] = []
        }

        result[item[key]].push(item)
    }

    return result
}

const colors = ['lightgreen', 'red', 'lightblue', 'yellow', 'white', 'purple', 'orange', 'cyan']

const Chart: React.FC<Props<any>> & Static = ({ type, items, x, y, z, color, axisColor, textColor, grid, width, height, ...props }) => {
    const isNamed = items && typeof items[0][x.name] === 'string'
    const data = z ? splitIntoCategories(items, z.name) : items

    const ChartRoot = mapTypeToComponent[type].chart
    const Component = mapTypeToComponent[type].component

    const isCartesian = type === ChartType.BAR || type === ChartType.SCATTER || type === ChartType.LINE

    return (
        <Root {...props} height={height} width={width}>
            <ChartRoot data={data as any} height={300} width={630}
                       margin={{ bottom: 15, top: 10, left: 15, right: 15 }}>
                {(type === ChartType.LINE || type === ChartType.SCATTER) && <CartesianGrid stroke={axisColor} />}

                {isCartesian && (
                    <XAxis
                        stroke={axisColor}
                        tick={{ fill: textColor }}
                        type={isNamed ? 'category' : 'number'}
                        dataKey={x.name}
                        name={x.title}
                        label={{ value: x.title, position: 'center', fill: textColor, dy: 20 }}
                        scale={x.log ? 'log' : undefined}
                        domain={[x.min || 'dataMin', x.max || 'dataMax']}
                        tickCount={12}
                        interval={0} />
                )}

                {isCartesian && x && y && (
                    <YAxis
                        stroke={axisColor}
                        tick={{ fill: textColor }}
                        type='number'
                        dataKey={y.name}
                        name={y.title}
                        label={{ value: y.title, position: 'center', angle: -90, fill: textColor, dx: -30 }}
                        scale={y.log ? 'log' : undefined}
                        domain={isNamed ? undefined : [y.min || 'dataMin', y.max || 'dataMax']}
                        tickFormatter={y.log ? Numbers.toExponential : undefined}
                        tickCount={5}
                        interval={0} />
                )}

                {z && <ZAxis dataKey={z.name} />}

                {z && (
                    <Legend
                        align='right'
                        layout='vertical'
                        verticalAlign='middle'
                        iconSize={10} />
                )}

                <Tooltip cursor={{ fill: Color.MEDIUM }} />

                {z ? (
                    Object.keys(data).map((category, i) => (
                        <Component data={(data as any)[category]} name={category} fill={colors[i]} key={i} opacity={0.5} />
                    ))
                ) : (
                    <Component fill={color} opacity={0.5} dataKey={y && y.name} cx={200} cy={200} outerRadius={60} data={items} />
                )}
            </ChartRoot>
        </Root>
    )

}

Chart.Type = ChartType

Chart.defaultProps = {
    color: '#5CF',
    textColor: Color.LIGHT,
    axisColor: Color.MEDIUM_LIGHT,
    grid: true,
    height: 300,
    width: '100%'
}

export default Chart