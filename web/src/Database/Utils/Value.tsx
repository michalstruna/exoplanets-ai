import React from 'react'
import Styled from 'styled-components'

import { LightCurve, StarData as StarData, StarProperties } from '../types'
import { Link } from '../../Routing'
import { Color } from '../../Style'
import { Numbers } from '../../Native'

type PropRenderer<TValue, TItem> = (prop: TValue, i: number, item: TItem) => React.ReactNode

type PropsOptions = {
    refMap?: Record<string, number>
    unit?: React.ReactNode
    format?: (val: any) => React.ReactNode
}

const RefLink = Styled(Link)`
    color: ${Color.BLUE};
    font-size: 90%;
    
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

    props: <T extends any>(star: StarData, name: keyof StarProperties, options?: PropsOptions): React.ReactNode | null => (
        star.properties.map((props, i) => {
            const refId = options?.refMap?.[props.dataset]
            const rawValue = props[name] !== null && props[name] !== undefined ? (options?.format ? options.format(props[name]) : props[name]) : null
            const value = options?.unit ? <>{Numbers.format(rawValue as number)}{options.unit === '°' ? '' : ' '}{options.unit}</> : rawValue

            return rawValue !== null && rawValue !== undefined ? (
                <div key={i}>
                    {value} {refId ? (<sup><RefLink hash={'ref' + refId}>[{refId}]</RefLink></sup>) : null}
                </div>
            ) : null
        })
    )

}