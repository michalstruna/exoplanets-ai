import React from 'react'
import { camelCase, pascalCase } from 'change-case'

import { Numbers } from '../../Native'
import ItemControls from '../Components/ItemControls'
import { Strings } from '../../Data'
import { Column } from '../../Layout'

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

interface ColOptionsList<Item> {
    strings: Strings
    indexColumnName?: string
    renderEditForm?: (item: Item) => React.ReactNode
    onRemove?: (item: Item) => void
    onReset?: (item: Item) => void
}

export const MultiValue = ({ items, property, formatter = val => val }: { items: any[], property: string, formatter?: (val: any, i: any, item: any) => any }) => items ? (
    <div>
        {items.filter(item => !!item[property]).map((item, i) => <div
            title={'Dataset: ' + item.dataset}>{formatter(item[property], item, i)}</div>)}
    </div>
) : null

/**
 * Get list of table columns from list of column options.
 * @param cols List of column options.
 * @param options Options for columns list. There should be strings and also optionally index and control columns.
 */
export const list = <T extends any>(cols: ColOptions<any, T>[], options: ColOptionsList<T>): Column<T, React.ReactNode>[] => {

    /**
     * Get column from column options.
     */
    const col = ({ format, multi, name, title, styleMap, icon, headerIcon, unit, ...props }: ColOptions<any, T>) => {
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
            name,
            title: title || options.strings[camelCase(name || '')],
            accessor: multi ? (item: any) => <MultiValue items={item[multi]} property={name!} formatter={formatter} /> : (item: any, i: number) => formatter(item[name!], item, i),
            headerIcon: headerIcon !== false && name ? `/img/Database/Table/${pascalCase(name)}.svg` : undefined,
            icon: icon && name ? `/img/Database/Table/${pascalCase(name)}.svg` : undefined,
            ...props
        }
    }

    const result = [...cols]

    if (options.indexColumnName) {
        result.unshift({ name: options.indexColumnName, width: '3rem', title: '#', headerIcon: false })
    }

    const controls = [options.renderEditForm, options.onRemove, options.onReset].filter(c => !!c)

    if (controls.length > 0) {
        result.push({ title: '', format: (val, item, i) => (
            <ItemControls
                key={i}
                renderEditForm={options.renderEditForm ? (() => options.renderEditForm!(item)) : undefined}
                onRemove={options.onRemove ? (() => options.onRemove!(item)) : undefined}
                onReset={options.onReset ? (() => options.onReset!(item)) : undefined} />
        ), width: controls.length * 0.5 + 0.36 })
    }

    return result.map(col)
}