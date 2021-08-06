import React from 'react'
import { renderToString } from 'react-dom/server'

import { DatasetItem, PlanetData, PlanetProperties, StarData, StarProperties } from '../types'
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

const propsGetter = <Item extends { properties: Values[] }, Values extends StarProperties | PlanetProperties>() => <NestedCategory extends keyof Values>(star: Item, name: keyof Values | [NestedCategory, keyof Values[NestedCategory]], options?: PropsOptions): React.ReactNode | null => {
    const cache: Record<string, [any, (string | undefined)[], React.ReactNode]> = {}

    for (const props of star.properties) {
        const refId = props.dataset
        const val = Array.isArray(name) ? props[name[0]][name[1]] : props[name]

        const rawValue = val !== null && val !== undefined ? (options?.format ? options.format(val) : val) : null
        const value = options?.unit ? <>{Numbers.format(rawValue as number)}{options.unit === '°' ? '' : ' '}{options.unit}</> : rawValue
        const json = rawValue !== null && rawValue !== undefined ? (value && (value as any).$$typeof ? renderToString(value as any) : JSON.stringify(value)) : null

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
        console.log(star)
        return [...star.properties, ...star.light_curves, ...star.aliases][0].name
    },

    names: (star: StarData, renderer: PropRenderer<string, DatasetItem>): any[] => {
        const items = [...star.properties, ...star.light_curves, ...star.aliases]
        const unique = [...new Set(items.map((item: DatasetItem) => item.name)) as any]
        return unique.map((name, i) => renderer(name, i, unique[i]))
    },

    prop: propGetter<StarData, StarProperties>(),
    props: propsGetter<StarData, StarProperties>()

}