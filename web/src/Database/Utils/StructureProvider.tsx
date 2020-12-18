import React from 'react'
import Styled from 'styled-components'
import Urls from 'url'
import prettyBytes from 'pretty-bytes'
import { pascalCase } from 'change-case'

import DbTable from '../Constants/DbTable'
import { Fraction, IconText, Level, ProgressBar } from '../../Layout'
import { Curve } from '../../Stats'
import { image, size } from '../../Style'
import { getDatasets, getStars, getPlanets } from '../Redux/Slice'
import { Dates, Numbers } from '../../Native'
import LifeType from '../Constants/LifeType'
import * as Col from './Col'
import { Dataset, PlanetData, PlanetProperties, StarData } from '../types'
import Detail from '../Components/TableItemDetail'
import SpectralClass from '../Constants/SpectralClass'
import { Cursor, EnumTextValues, Strings } from '../../Data'
import PlanetType from '../Constants/PlanetType'
import { DatasetType, Value } from '../index'
import DatasetPriority from '../Constants/DatasetPriority'
import LuminosityClass from '../Constants/LuminosityClass'
import PlanetStatus from '../Constants/PlanetStatus'
import BodyType from '../Components/BodyType'
import { Url } from '../../Routing'
import { MultiValue } from './Col'
import DatasetForm from '../Components/DatasetForm'

const DateTime = ({ s }: { s: number }) => (
    <>
        {Dates.formatDate(s)}
        <br />
        {Dates.formatTime(s)}
    </>
)

const OptionalLine = ({ lines }: { lines: (string | null)[] }) => (
    <>
        {lines.filter(line => !!line).map(line => <div>{line}</div>)}
    </>
)

const lifeTypeStyle = { [LifeType.PROMISING]: { color: '#AFA', fontWeight: 'bold' }, [LifeType.IMPOSSIBLE]: { color: '#FAA' }, [LifeType.UNKNOWN]: { color: '#777', fontStyle: 'italic' }, [LifeType.POSSIBLE]: { color: '#5FF', fontWeight: 'bold' } }
const planetStatusStyle = { [PlanetStatus.CANDIDATE]: { color: '#AAA', fontStyle: 'italic' }, [PlanetStatus.CONFIRMED]: { color: '#AFA', fontWeight: 'bold' }, [PlanetStatus.REJECTED]: { color: '#F55' } }
const priorityStyle = { 1: { color: '#666' }, 2: { color: '#888' }, 3: { color: '#EEE' }, 4: { color: '#EAA', fontWeight: 'bold' }, 5: { color: '#F55', fontWeight: 'bold' } }

// TODO: Hooks instaed providers?
// TODO: Root strings in parameter.
export const provideFilterColumns = (table: DbTable, strings: any): [string, string, EnumTextValues][] => {
    switch (table) {
        case DbTable.BODIES:
            return [
                ['name', strings.properties.name, String],
                ['spectral_class', strings.properties.spectral_class, Object.values(SpectralClass).map(value => ({ text: `${strings.stars.colors[value]} (${value})`, value }))],
                ['luminosity_class', strings.properties.luminosity_class, Object.values(LuminosityClass).map(value => ({ text: `${strings.stars.sizes[value]} (${value})`, value }))],
                ['diameter', strings.properties.diameter + ' [☉]', Number],
                ['mass', strings.properties.mass + ' [☉]', Number],
                ['density', strings.properties.density + ' [kg/m^3]', Number],
                ['surface_temperature', strings.properties.surfaceTemperature + ' [K]', Number],
                ['distance', strings.properties.distance + ' [ly]', Number],
                ['luminosity', strings.properties.luminosity + ' [☉]', Number],
                ['transit_depth', strings.properties.transit, Number],
                ['planets', strings.properties.planets, Number],
                ['surface_gravity', strings.properties.surfaceGravity + ' [km/s]', Number],
                ['absolute_magnitude', strings.properties.absoluteMagnitude, Number],
                ['apparent_magnitude', strings.properties.apparentMagnitude, Number],
                ['metallicity', strings.properties.metallicity, Number],
                ['life_conditions', strings.properties.lifeConditions, Object.values(LifeType).map(value => ({ text: strings.planets.lifeConditionsTypes[value], value }))],
                ['dataset', strings.properties.dataset, String],
                ['planet_name', strings.properties.name + ' (' + strings.properties.planet + ')', String],
                ['planet_type', strings.properties.type + ' (' + strings.properties.planet + ')', Object.values(PlanetType).map(value => ({ text: strings.planets.types[value], value }))],
                ['planet_diameter', strings.properties.diameter + ' [⊕]' + ' (' + strings.properties.planet + ')', Number],
                ['planet_mass', strings.properties.mass + ' [⊕]' + ' (' + strings.properties.planet + ')', Number],
                ['planet_density', strings.properties.density + ' [kg/m^3]' + ' (' + strings.properties.planet + ')', Number],
                ['planet_surface_temperature', strings.properties.surfaceTemperature + ' [°C]' + ' (' + strings.properties.planet + ')', Number],
                ['planet_semi_major_axis', strings.properties.semiMajorAxis + ' [au]' + ' (' + strings.properties.planet + ')', Number],
                ['planet_orbital_period', strings.properties.orbitalPeriod + ' [d]' + ' (' + strings.properties.planet + ')', Number],
                ['planet_orbital_velocity', strings.properties.orbitalVelocity + ' [km/s]' + ' (' + strings.properties.planet + ')', Number],
                ['planet_life_conditions', strings.properties.lifeConditions + ' (' + strings.properties.planet + ')', Object.values(LifeType).map(value => ({ text: strings.planets.lifeConditionsTypes[value], value }))],
                ['planet_transit_depth', strings.properties.transit + ' (' + strings.properties.planet + ')', Number],
                ['planet_dataset', strings.properties.dataset + ' (' + strings.properties.planet + ')', String]
            ]
        case DbTable.STARS:
            return [
                ['name', strings.properties.name, String],
                //['type', strings.properties.type, Object.values(StarSize).map(value => ({ text: strings.stars.types[value], value }))],
                ['diameter', strings.properties.diameter + ' [☉]', Number],
                ['mass', strings.properties.mass + ' [☉]', Number],
                ['density', strings.properties.density + ' [kg/m^3]', Number],
                ['surface_temperature', strings.properties.surfaceTemperature + ' [K]', Number],
                ['distance', strings.properties.distance + ' [ly]', Number],
                ['luminosity', strings.properties.luminosity + ' [☉]', Number],
                ['gravity', strings.properties.surfaceGravity + ' [km/s]', Number],
                ['life_conditions', strings.properties.lifeConditions, Object.values(LifeType).map(value => ({ text: strings.planets.lifeConditionsTypes[value], value }))],
                ['distance', strings.properties.distance + ' [ly]', Number],
                ['transit_depth', strings.properties.transit, Number],
                ['dataset', strings.properties.dataset, String]
            ]
        case DbTable.PLANETS:
            return [
                ['name', strings.properties.name, String],
                ['type', strings.properties.type, Object.values(PlanetType).map(value => ({ text: strings.planets.types[value], value }))],
                ['diameter', strings.properties.diameter + ' [⊕]', Number],
                ['mass', strings.properties.mass + ' [⊕]', Number],
                ['density', strings.properties.density + ' [kg/m^3]', Number],
                ['surface_temperature', strings.properties.surfaceTemperature + ' [°C]', Number],
                ['semi_major_axis', strings.properties.semiMajorAxis + ' [au]', Number],
                ['orbital_period', strings.properties.orbitalPeriod + ' [d]', Number],
                ['orbital_velocity', strings.properties.orbitalVelocity + ' [km/s]', Number],
                ['life_conditions', strings.properties.lifeConditions, Object.values(LifeType).map(value => ({ text: strings.planets.lifeConditionsTypes[value], value }))],
                ['distance', strings.properties.distance + ' [ly]', Number],
                ['transit_depth', strings.properties.transit, Number],
                ['dataset', strings.properties.dataset, String]
            ]
        case DbTable.DATASETS:
            return [
                ['name', strings.properties.name, String],
                ['type', strings.properties.type, Object.values(DatasetType).map(value => ({ text: strings.datasets.types[value], value }))],
                ['total_size', strings.properties.totalSize, Number],
                ['processed', strings.properties.processed + ' [B]', Number],
                ['time', strings.properties.time + ' [s]', Number],
                ['created', strings.properties.published, Date],
                ['modified', strings.properties.modified, Date],
                ['priority', strings.properties.priority, Object.values(DatasetPriority).filter(value => typeof value === 'number').map(value => ({ text: strings.datasets.priorities[value], value }))], // TODO: DatasetPriority enum.
                ['url', strings.properties.url, String]
            ]
    }

    return []
}

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


export const provideStructure = (table: DbTable, strings: Strings): Structure => {
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
                        ], { strings: strings.stars, indexColumnName: 'index' })
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
                        ], { strings: strings.planets, indexColumnName: 'index' }),
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
                            { name: 'name', format: (val, item) => <Detail pathname='/abc' title={item.properties[0].name} subtitle={strings.planets.types[item.properties[0].type]} />, width: 1.5, headerIcon: false },
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
                            { name: 'name', format: (val, item) => <Detail pathname='/abc' title={val} subtitle={strings.datasets.types[item.type]} />, width: 1.5, headerIcon: false },
                            { name: 'total_size', format: Numbers.format },
                            { name: 'processed', format: (val, item) => <ProgressBar range={item.total_size} value={item.total_size - item.current_size} label={prettyBytes(item.processed || 0)} title={`${Numbers.format(item.total_size - item.current_size)} / ${Numbers.format(item.total_size)}`} /> },
                            { name: 'time', format: val => Dates.formatDistance(strings, 0, val, Dates.Format.LONG) },
                            { name: 'created', format: val => <DateTime s={val} />, title: strings.properties.published },
                            { name: 'modified', format: val => Dates.formatDistance(strings, val) },
                            { name: 'priority', format: val => strings.datasets.priorities[val - 1], styleMap: priorityStyle },
                            { name: 'url', format: (val, item) => <OptionalLine lines={[Urls.parse(item.items_getter || '').hostname, Urls.parse(item.item_getter || '').hostname]} />, width: 2 }
                        ], { strings: strings.datasets, indexColumnName: 'index', renderEditForm: item => <DatasetForm dataset={item} />, onRemove: () => null })
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

// 622 601, 548, 601, 523, 463, 456, 367, 228, 277