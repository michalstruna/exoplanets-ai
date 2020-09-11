import { StarData as StarData, StarProperties } from '../types'

type WithName = {
    name?: string
}

type NameRenderer<T> = (name: string, i?: number) => T

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

    names: <T extends any>(star: StarData, renderer: NameRenderer<T>): any[] => (
        [...star.properties, ...star.light_curves].map((item: WithName, i) => item.name && renderer(item.name, i))
    ),

    prop: <T extends any>(star: StarData, name: keyof StarProperties): T | null => {
        for (const properties of star.properties) {
            if (properties[name]) {
                return properties[name] as any
            }
        }

        return null
    }

}