import React from 'react'
import { renderToString } from 'react-dom/server'

import { LightCurveData, PlanetData, PlanetProperties, StarData, StarProperties } from '../types'
import { Numbers } from '../../Native'
import Ref from '../Components/Ref'

type PropRenderer<TValue, TItem> = (prop: TValue, i: number, item: TItem) => React.ReactNode

type PropsOptions = {
    refMap?: Record<string, number>
    unit?: React.ReactNode
    format?: (val: any) => React.ReactNode
    render?: (val: any, ref: React.ReactNode) => React.ReactNode
    isEstimate?: (props: any) => boolean
}

const propsGetter = <Item extends { properties: Values[] }, Values extends any>() => (star: Item, name: keyof Values, options?: PropsOptions): React.ReactNode | null => {
    const cache: Record<string, [any, (string | undefined)[], React.ReactNode]> = {}

    for (const props of star.properties) {
        const refId = props.dataset
        const rawValue = props[name] !== null && props[name] !== undefined ? (options?.format ? options.format(props[name]) : props[name]) : null
        const value = options?.unit ? <>{Numbers.format(rawValue as number)}{options.unit === '°' ? '' : ' '}{options.unit}</> : rawValue
        const json = rawValue !== null && rawValue !== undefined ? (value && value.$$typeof ? renderToString(value) : JSON.stringify(value)) : null

        if (json !== null) {
            if (!cache[json]) {
                cache[json] = [value, [], '±']
            }

            cache[json][1].push(refId)

            if (!options?.isEstimate?.(props)) {
                cache[json][2] = null
            }
        }
    }

    return Object.entries(cache).map(([key, [value, refs, prefix]], i) => options?.render ? options.render(value, <Ref refMap={options?.refMap} refs={refs} />) : (
        <div key={i}>
            {prefix}{value} <Ref refMap={options?.refMap} refs={refs} />
        </div>
    ))
}

const propGetter = <Item extends { properties: Values[] }, Values extends any>() => (item: Item, name: keyof Values) => {
    for (const properties of item.properties) {
        if (properties[name]) {
            return properties[name] as any
        }
    }

    return null
}

export const Planet = {
    prop: propGetter<PlanetData, PlanetProperties>(),
    props: propsGetter<PlanetData, PlanetProperties>()
}

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

    names: (star: StarData, renderer: PropRenderer<string, StarProperties | LightCurveData>): any[] => {
        const items = [...star.properties, ...star.light_curves]
        const unique = [...new Set(items.map((item: StarProperties | LightCurveData) => item.name)) as any]
        return unique.map((name, i) => renderer(name, i, unique[i]))
    },

    prop: propGetter<StarData, StarProperties>(),
    props: propsGetter<StarData, StarProperties>()

}