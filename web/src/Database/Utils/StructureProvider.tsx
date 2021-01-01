import React from 'react'
import Styled from 'styled-components'
import Urls from 'url'
import prettyBytes from 'pretty-bytes'
import { pascalCase } from 'change-case'
import { Dispatch } from 'redux'

import DbTable from '../Constants/DbTable'
import { Fraction, IconText, Level, ProgressBar } from '../../Layout'
import { Curve } from '../../Stats'
import { Color, Duration, image, size } from '../../Style'
import { getDatasets, getStars, deleteStar, getPlanets, resetDataset } from '../Redux/Slice'
import { Dates, Numbers } from '../../Native'
import LifeType from '../Constants/LifeType'
import * as Col from './Col'
import { Dataset, PlanetData, PlanetProperties, StarData } from '../types'
import Detail from '../Components/TableItemDetail'
import { Cursor, Strings } from '../../Data'
import {  Value, deleteDataset } from '../index'
import PlanetStatus from '../Constants/PlanetStatus'
import BodyType from '../Components/BodyType'
import { Link, Url } from '../../Routing'
import { MultiValue } from './Col'
import DatasetForm from '../Components/DatasetForm'
import DatasetsSelectionForm from '../Components/DatasetsSelectionForm'

const DateTime = ({ s }: { s: number }) => (
    <>
        {Dates.formatDate(s)}
        <br />
        {Dates.formatTime(s)}
    </>
)

interface OptionalLineProps {
    lines: React.ReactNode[]
    format?: (item: React.ReactNode) => React.ReactNode
}

const OptionalLine = ({ lines, format }: OptionalLineProps) => (
    <>
        {lines.filter(line => !!line).map(line => <div style={{ width: '100%' }}>{format ? format(line!) : line}</div>)}
    </>
)

const TextLink = Styled(Link)`
    border-bottom: 1px solid ${Color.LIGHT};
    overflow: hidden;
    text-overflow: ellipsis;
    transition: border-color ${Duration.FAST};
    max-width: calc(100% - 1.5rem);
    
    &:hover, &:active {
        border-color: transparent;
    }
`

const lifeTypeStyle = { [LifeType.PROMISING]: { color: '#AFA', fontWeight: 'bold' }, [LifeType.IMPOSSIBLE]: { color: '#FAA' }, [LifeType.UNKNOWN]: { color: '#777', fontStyle: 'italic' }, [LifeType.POSSIBLE]: { color: '#5FF', fontWeight: 'bold' } }
const planetStatusStyle = { [PlanetStatus.CANDIDATE]: { color: '#AAA', fontStyle: 'italic' }, [PlanetStatus.CONFIRMED]: { color: '#AFA', fontWeight: 'bold' }, [PlanetStatus.REJECTED]: { color: '#F55' } }
const priorityStyle = { 1: { color: '#666' }, 2: { color: '#888' }, 3: { color: '#EEE' }, 4: { color: '#EAA', fontWeight: 'bold' }, 5: { color: '#F55', fontWeight: 'bold' } }

type Structure = {
    levels: Level[]
    getter: (cursor: Cursor) => void
    rowHeight: (row: number, level: number) => number
}

interface PropertiesProps {
    item: StarData | PlanetData
    render: (name: string, type: any) => React.ReactElement
}

const Properties = ({ item, render }: PropertiesProps) => {
    if (!item.properties || !item.properties[0]) {
        if ('light_curves' in item && item.light_curves[0]) {
            return render(item.light_curves[0].name, {})
        }

        return null
    }

    return render(item.properties[0].name, item.properties[0].type)
}


export const provideStructure = (table: DbTable, strings: Strings, dispatch: Dispatch<any>): Structure => {
    switch (table) {
        case DbTable.BODIES:
            return {
                levels: [
                    {
                        columns: Col.list<StarData>([
                            { name: 'type', format: (val, item) => <Properties item={item} render={(name, type) => <ItemImage image={`Database/Star/${type.spectral_class || 'Unknown'}.svg`} large={true} />} />, width: '5rem', headerIcon: false },
                            { name: 'name', format: (val, item) => <Properties item={item} render={name => <Detail pathname={`${Url.SYSTEM}/${Value.Star.name(item)}`} title={name} subtitle={<BodyType body={item} />} />} />, width: 1.5, headerIcon: false },
                            { name: 'diameter', unit: '☉', multi: 'properties' },
                            { name: 'mass', unit: '☉', multi: 'properties' },
                            { name: 'density', unit: <Fraction top='kg' bottom={<>m<sup>3</sup></>}/>, multi: 'properties' },
                            { name: 'surface_temperature', unit: 'K', multi: 'properties' },
                            { name: 'distance', unit: 'ly', multi: 'properties' },
                            { name: 'luminosity', unit: '☉', multi: 'properties' },
                            { name: 'transit_depth', format: (_, item) => item.light_curves[0] && <Curve data={item.light_curves[0]} simple={true} type={Curve.LC} />, title: <Colored color='#FAA'>{strings.properties.lightCurve}</Colored>, width: '20rem' },
                            { name: 'planets', format: (val, item) => item.planets.length },
                            { name: 'surface_gravity', unit: <Fraction top='m' bottom={<>s<sup>2</sup></>}/>, multi: 'properties' },
                            { name: 'absolute_magnitude', format: Numbers.format, multi: 'properties' },
                            { name: 'apparent_magnitude', format: Numbers.format, multi: 'properties' },
                            { name: 'metallicity', format: Numbers.format, multi: 'properties' },
                            { name: 'ra', format: Numbers.formatHours, multi: 'properties' },
                            { name: 'dec', format: Numbers.formatDeg, multi: 'properties' },
                            { name: 'dataset', format: (_, item) => (
                                    <div>
                                        <MultiValue items={item.properties} property='dataset' formatter={val => <IconText text={val} icon='/img/Database/Dataset/StarProperties.svg' />} />
                                        <MultiValue items={item.light_curves} property='dataset' formatter={val => <IconText text={val} icon='/img/Database/Dataset/TargetPixel.svg' />} />
                                    </div>
                                ), width: 1.5 }
                        ], {
                            strings: strings.stars,
                            indexColumnName: 'index',
                            renderRemove: item => (
                                <DatasetsSelectionForm
                                    item={item}
                                    key={JSON.stringify(item)}
                                    categories={[['properties', 'dataset', strings.stars.quantitites], ['light_curves', 'dataset', strings.stars.curves]]}
                                    onSubmit={values => dispatch(deleteStar([item._id, values]))}
                                    submitLabel={strings.datasets.selection.delete} />
                            ),
                            onRemove: () => null,
                            onReset: () => null
                        })
                    },
                    {
                        columns: Col.list<PlanetData>([
                            { name: 'type', format: (val, item) => item.properties && item.properties[0] && <ItemImage image={`Database/Planet/${pascalCase(item.properties[0].type || 'Unknown')}.png`} />, width: '5rem', headerIcon: false },
                            { name: 'name', format: (val, item) => item.properties && item.properties[0] && <Detail pathname='/abc' title={item.properties[0].name} subtitle={strings.planets.types[item.properties[0].type] || strings.planets.unknownType} />, width: 1.5, headerIcon: false },
                            { name: 'diameter', unit: '⊕', multi: 'properties' },
                            { name: 'mass', unit: '⊕', multi: 'properties' },
                            { name: 'density', unit: <Fraction top='kg' bottom={<>m<sup>3</sup></>}/>, multi: 'properties' },
                            { name: 'surface_temperature', unit: '°C', multi: 'properties' },
                            { name: 'semi_major_axis', unit: 'au', multi: 'properties' },
                            { name: 'orbital_period', format: val => Dates.formatDistance(strings, Dates.daysToMs(val), 0, Dates.Format.EXACT), multi: 'properties' },
                            { name: 'transit_depth', format: (_, planet) => planet.properties[0]?.transit?.local_view && <Curve data={planet.properties[0].transit.local_view as any} simple={true} type={Curve.LV} />, title: <Colored color='#AFA'>{strings.properties.transit}</Colored>, width: '20rem' },
                            { name: 'life_conditions', format: val => strings.planets.lifeConditionsTypes[val], styleMap: lifeTypeStyle, multi: 'properties' },
                            { name: 'surface_gravity', unit: <Fraction top='m' bottom={<>s<sup>2</sup></>}/>, multi: 'properties' },
                            { name: 'orbital_velocity', unit: <Fraction top='km' bottom='s' />, multi: 'properties' },
                            { name: 'stat   us', format: value => strings.planets.statuses[value], styleMap: planetStatusStyle },
                            { name: 'todo' },
                            { name: 'todo' },
                            { name: 'todo' },
                            { name: 'dataset', format: (val, planet, i) => <IconText text={val} icon={`/img/Database/Dataset/${(planet as any).processed ? 'TargetPixel' : 'PlanetProperties'}.svg`} />, width: 1.5, multi: 'properties' }
                        ], {
                            strings: strings.planets,
                            indexColumnName: 'index',
                            renderRemove: item => <b>123456789</b>,
                            onRemove: () => null,
                            onReset: () => null
                        }),
                        accessor: (star: StarData) => star.planets
                    }
                ],
                getter: getStars,
                rowHeight: () => 96
            }
        case DbTable.STARS:
            return {
                levels: [
                    {
                        columns: Col.list<StarData>([
                            { name: 'type', format: (val, item) => <Properties item={item} render={(name, type) => <ItemImage image={`Database/Star/${type.spectral_class || 'Unknown'}.svg`} large={true} />} />, width: '5rem', headerIcon: false },
                            { name: 'name', format: (val, item) => <Properties item={item} render={name => <Detail pathname={`${Url.SYSTEM}/${Value.Star.name(item)}`} title={name} subtitle={<BodyType body={item} />} />} />, width: 1.5, headerIcon: false },
                            { name: 'diameter', unit: '☉', multi: 'properties' },
                            { name: 'mass', unit: '☉', multi: 'properties' },
                            { name: 'density', unit: <Fraction top='kg' bottom={<>m<sup>3</sup></>}/>, multi: 'properties' },
                            { name: 'surface_temperature', unit: 'K', multi: 'properties' },
                            { name: 'distance', unit: 'ly', multi: 'properties' },
                            { name: 'luminosity', unit: '☉', multi: 'properties' },
                            { name: 'gravity', unit: <Fraction top='m' bottom={<>s<sup>2</sup></>}/>, multi: 'properties' },
                            { name: 'planets', format: (val, item) => item.planets.length },
                            { name: 'transit_depth', format: (_, item) => item.light_curves[0] && <Curve data={item.light_curves[0]} simple={true} type={Curve.LC} />, title: <Colored color='#FAA'>{strings.properties.lightCurve}</Colored>, width: '20rem' },
                            { name: 'dataset', format: val => <IconText text={val} icon='/img/Database/Dataset/StarProperties.svg' />, width: 1.5, multi: 'properties' }
                        ], strings)
                    }
                ],
                getter: getStars,
                rowHeight: () => 96
            }
        case DbTable.PLANETS:
            return {
                levels: [
                    {
                        columns: Col.list<PlanetData>([
                            { name: 'type', format: (val, item) => <ItemImage image={`Database/Planet/${pascalCase(item.properties[0].type)}.png`} />, width: '4rem', headerIcon: false },
                            { name: 'name', format: (val, item) => <Detail title={item.properties[0].name} subtitle={strings.planets.types[item.properties[0].type]} />, width: 1.5, headerIcon: false },
                            { name: 'diameter', unit: '⊕', multi: 'properties' },
                            { name: 'mass', unit: '⊕', multi: 'properties' },
                            { name: 'density', unit: <Fraction top='kg' bottom={<>m<sup>3</sup></>}/>, multi: 'properties' },
                            { name: 'surface_temperature', unit: '°C', multi: 'properties' },
                            { name: 'semi_major_axis', unit: 'au', multi: 'properties' },
                            { name: 'orbital_period', format: val => Dates.formatDistance(strings, Dates.daysToMs(val), 0, Dates.Format.EXACT), multi: 'properties' },
                            { name: 'orbital_velocity', unit: <Fraction top='km' bottom='s' />, multi: 'properties' },
                            { name: 'life_conditions', format: val => strings.planets.lifeConditionsTypes[val], styleMap: lifeTypeStyle, multi: 'properties' },
                            { name: 'distance', format: val => '4.2 ly' },
                            { name: 'transit_depth', format: () => null/*<Curve data={[]} color='#AFA' simple={true} />*/, title: <Colored color='#AFA'>{strings.properties.transit}</Colored>, width: '20rem' },
                            { name: 'dataset', format: val => <IconText text={val} icon='/img/Database/Dataset/PlanetProperties.svg' />, width: 1.5, multi: 'properties' }
                        ], strings)
                    }
                ],
                getter: getPlanets,
                rowHeight: () => 96
            }
        case DbTable.DATASETS:
            return {
                levels: [
                    {
                        columns: Col.list<Dataset>([
                            { name: 'type', format: val => <ItemImage image={`Database/Dataset/${pascalCase(val)}.svg`} />, width: '4rem', headerIcon: false },
                            { name: 'name', format: (val, item) => <Detail title={val} subtitle={strings.datasets.types[item.type]} />, width: 1.5, headerIcon: false },
                            { name: 'total_size', format: Numbers.format },
                            { name: 'processed', format: (val, item) => <ProgressBar range={item.total_size} value={item.total_size - item.current_size} label={prettyBytes(item.processed || 0)} title={`${Numbers.format(item.total_size - item.current_size)} / ${Numbers.format(item.total_size)}`} /> },
                            { name: 'time', format: val => Dates.formatDistance(strings, 0, val, Dates.Format.LONG) },
                            { name: 'created', format: val => <DateTime s={val} />, title: strings.properties.published },
                            { name: 'modified', format: val => Dates.formatDistance(strings, val) },
                            { name: 'priority', format: val => strings.datasets.priorities[val], styleMap: priorityStyle },
                            { icon: true, title: 'URL', name: 'items_getter', format: (val, item) => <OptionalLine lines={[item.items_getter, item.item_getter]} format={url => <TextLink pathname={url as string}>{Urls.parse(url as string).hostname}</TextLink>} />, width: 1.75     }
                        ], {
                            strings: strings.datasets,
                            indexColumnName: 'index',
                            renderEdit: item => <DatasetForm dataset={item} />,
                            onRemove: d => dispatch(deleteDataset(d._id)),
                            onReset: d => dispatch(resetDataset(d._id))
                        })
                    }
                ],
                getter: getDatasets,
                rowHeight: () => 72
            }
    }

    return null as any
}

interface Colored {
    color: string
}

const Colored = Styled.span<Colored>`
    color: ${props => props.color};
    `

interface ItemImageProps {
    large?: boolean
    image: string
}

const ItemImage = Styled.div<ItemImageProps>`
    ${props => size(props.large ? '4rem' : '2.5rem')}
    ${props => image(props.image)}
    display: inline - block
`
