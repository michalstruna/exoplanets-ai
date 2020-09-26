import React from 'react'
import Styled from 'styled-components'
import { renderToString } from 'react-dom/server'

import { LightCurve, StarData as StarData, StarProperties } from '../types'
import { Link } from '../../Routing'
import { Color } from '../../Style'
import { Numbers } from '../../Native'
import Ref from '../Components/Ref'

type PropRenderer<TValue, TItem> = (prop: TValue, i: number, item: TItem) => React.ReactNode

type PropsOptions = {
    refMap?: Record<string, number>
    unit?: React.ReactNode
    format?: (val: any) => React.ReactNode
}

const RefLink = Styled(Link)`
    color: ${Color.BLUE};
    font-size: 90%;
    margin-right: 0.3em;
    
    &:not(:hover) {
        border-bottom: 1px solid ${Color.BLUE};
    }
`

export const Star = {
    name: (star: StarData): string | null => {
        for (const property of star.properties) {
            if (property.name) {
                return property.name
            }
        }

        for (const light_curve of star.light_curves) {
            if (light_curve.name) {
                return light_curve.name
            }
        }

        return null
    },

    names: (star: StarData, renderer: PropRenderer<string, StarProperties | LightCurve>): any[] => {
        const items = [...star.properties, ...star.light_curves]
        const unique = [...new Set(items.map((item: StarProperties | LightCurve) => item.name)) as any]
        return unique.map((name, i) => renderer(name, i, unique[i]))
    },

    prop: <T extends any>(star: StarData, name: keyof StarProperties): T | null => {
        for (const properties of star.properties) {
            if (properties[name]) {
                return properties[name] as any
            }
        }

        return null
    },

    props: <T extends any>(star: StarData, name: keyof StarProperties, options?: PropsOptions): React.ReactNode | null => {
        const cache: Record<string, [any, (string | undefined)[]]> = {}

        for (const props of star.properties) {
            const refId = props.dataset
            const rawValue = props[name] !== null && props[name] !== undefined ? (options?.format ? options.format(props[name]) : props[name]) : null
            const value = options?.unit ? <>{Numbers.format(rawValue as number)}{options.unit === '°' ? '' : ' '}{options.unit}</> : rawValue
            const json = rawValue !== null && rawValue !== undefined ? renderToString(value as any) : null

            if (json !== null) {
                if (!cache[json]) {
                    cache[json] = [value, []]
                }

                cache[json][1].push(refId)
            }
        }

        return Object.entries(cache).map(([key, [value, refs]], i) => (
            <div key={i}>
                {value} <Ref refMap={options?.refMap} refs={refs} />
            </div>
        ))
    }

}