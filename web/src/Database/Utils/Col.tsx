import React from 'react'
import { camelCase, pascalCase } from 'change-case'

import { Numbers } from '../../Native'
import ItemControls from '../Components/ItemControls'

interface ColOptions<TVal, TItem> {
    name?: string
    title?: React.ReactNode
    format?: (val: TVal, item: TItem, i: number) => React.ReactNode
    multi?: string
    icon?: boolean
    unit?: React.ReactNode
    headerIcon?: boolean
    width?: string | number
    styleMap?: Record<string | number, any>
}

const MultiValue = ({ items, property, formatter = val => val }: { items: any[], property: string, formatter?: (val: any, i: any, item: any) => any }) => (
    <div>
        {items.filter(item => !!item[property]).map((item, i) => <div
            title={'Dataset: ' + item.dataset}>{formatter(item[property], item, i)}</div>)}
    </div>
)

export const list = <T extends any>(cols: ColOptions<any, T>[], strings: any): any => {

    // =========================================================================
    const col = <T extends any>({ format, multi, name, title, styleMap, icon, headerIcon, unit, ...props }: ColOptions<any, T>) => {
        let formatter = unit ? ((val: number) => <>{Numbers.format(val)} {unit}</>) : format ? format : (val: T) => val

        if (styleMap) {
            let f = formatter

            formatter = (val: any, item: any, i: number) => (
                <div style={styleMap ? styleMap[val] : undefined}>
                    {f(val, item, i)}
                </div>
            )
        }

        return {
            title: title || strings.properties[camelCase(name || '')], name,
            accessor: multi ? (item: any) => <MultiValue items={item[multi]} property={name!} formatter={formatter} /> : (item: any, i: number) => formatter(item[name!], item, i),
            headerIcon: headerIcon !== false && name ? `/img/Database/Table/${pascalCase(name)}.svg` : undefined,
            icon: icon && name ? `/img/Database/Table/${pascalCase(name)}.svg` : undefined,
            ...props
        }
    }

    const result = [...cols]

    if (true) {
        //result.unshift({ title: '#', format: (val: T, item: any, i: number) => i + 1, width: '3rem' })
        result.unshift({ name: 'index', width: '3rem', title: '#', headerIcon: false })
    }

    if (true) {
        result.push({ title: '', format: (val, item, i) => <ItemControls onEdit={() => null} onRemove={() => null} />, width: 1.5 })
    }

    return result.map(col)
}