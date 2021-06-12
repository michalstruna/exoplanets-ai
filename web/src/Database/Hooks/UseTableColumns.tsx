import React from 'react'
import Styled, { css } from 'styled-components'
import Urls from 'url'
import { pascalCase } from 'change-case'
import { useDispatch } from 'react-redux'
import Countries from 'emoji-flags'

import DbTable from '../Constants/DbTable'
import { Fraction, IconText, Level, ProgressBar } from '../../Layout'
import { Curve } from '../../Stats'
import { Color, Duration, image, size } from '../../Style'
import { deleteStar, getDatasets, getPlanets, getStars, resetDataset } from '../Redux/Slice'
import { Dates, Numbers } from '../../Native'
import LifeType from '../Constants/LifeType'
import * as Col from '../Utils/Col'
import { MultiValue } from '../Utils/Col'
import { Dataset, PlanetData, StarData } from '../types'
import Detail from '../Components/TableItemDetail'
import { Cursor, Units, UnitType, useStrings } from '../../Data'
import { deleteDataset, useTable, Value } from '../index'
import PlanetStatus from '../Constants/PlanetStatus'
import BodyType from '../Components/BodyType'
import { Link, Url } from '../../Routing'
import DatasetForm from '../Components/DatasetForm'
import DatasetsSelectionForm from '../Components/DatasetsSelectionForm'
import { getUsers, User } from '../../User'
import Diff from '../../Layout/Components/Diff'
import Avatar from '../../User/Components/Avatar'
import Sex from '../../User/Constants/Sex'

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

const UseTableColumns = (): Structure => {

    const dispatch = useDispatch()
    const table = useTable()
    const strings = useStrings()
    const { stars, planets, datasets, users } = strings

    return React.useMemo(() => {
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
                                { name: 'transit_depth', format: (_, item) => item.light_curves[0] && <Curve data={item.light_curves[0]} simple={true} type={Curve.LC} />, title: <Colored color='#FAA'>{strings.stars.lightCurve}</Colored>, width: '20rem' },
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
                                strings: stars,
                                indexColumnName: 'index',
                                renderRemove: item => (
                                    <DatasetsSelectionForm
                                        item={item}
                                        key={JSON.stringify(item)}
                                        categories={[['properties', 'dataset', strings.stars.quantitites], ['light_curves', 'dataset', strings.stars.curves]]}
                                        onSubmit={values => dispatch(deleteStar([item._id, values]))}
                                        submitLabel={strings.datasets.selection.delete} />
                                ),
                                onRemove:() => null
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
                                { name: 'transit_depth', format: (_, planet) => planet.properties[0]?.transit?.local_view && <Curve data={planet.properties[0].transit.local_view as any} simple={true} type={Curve.LV} />, title: <Colored color='#AFA'>{strings.planets.transit}</Colored>, width: '20rem' },
                                { name: 'life_conditions', format: val => strings.planets.lifeConditionsTypes[val], styleMap: lifeTypeStyle, multi: 'properties' },
                                { name: 'surface_gravity', unit: <Fraction top='m' bottom={<>s<sup>2</sup></>}/>, multi: 'properties' },
                                { name: 'orbital_velocity', unit: <Fraction top='km' bottom='s' />, multi: 'properties' },
                                { name: 'stat   us', format: value => strings.planets.statuses[value], styleMap: planetStatusStyle },
                                { name: 'todo' },
                                { name: 'todo' },
                                { name: 'todo' },
                                { name: 'dataset', format: (val, planet, i) => <IconText text={val} icon={`/img/Database/Dataset/${(planet as any).processed ? 'TargetPixel' : 'PlanetProperties'}.svg`} />, width: 1.5, multi: 'properties' }
                            ], {
                                strings: planets,
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
                                { name: 'surface_gravity', unit: <Fraction top='m' bottom={<>s<sup>2</sup></>}/>, multi: 'properties' },
                                { name: 'planets', format: (val, item) => item.planets.length },
                                { name: 'transit_depth', format: (_, item) => item.light_curves[0] && <Curve data={item.light_curves[0]} simple={true} type={Curve.LC} />, title: <Colored color='#FAA'>{strings.stars.lightCurve}</Colored>, width: '20rem' },
                                { name: 'dataset', format: val => <IconText text={val} icon='/img/Database/Dataset/StarProperties.svg' />, width: 1.5, multi: 'properties' }
                            ], {
                                strings: stars,
                                indexColumnName: 'index'
                            })
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
                                { name: 'type', format: (val, item) => item.properties && item.properties[0] && <ItemImage image={`Database/Planet/${pascalCase(item.properties[0].type || 'Unknown')}.png`} />, width: '5rem', headerIcon: false },
                                { name: 'name', format: (val, item) => item.properties && item.properties[0] && <Detail pathname='/abc' title={item.properties[0].name} subtitle={strings.planets.types[item.properties[0].type] || strings.planets.unknownType} />, width: 1.5, headerIcon: false },
                                { name: 'diameter', unit: '⊕', multi: 'properties' },
                                { name: 'mass', unit: '⊕', multi: 'properties' },
                                { name: 'density', unit: <Fraction top='kg' bottom={<>m<sup>3</sup></>}/>, multi: 'properties' },
                                { name: 'surface_temperature', unit: '°C', multi: 'properties' },
                                { name: 'semi_major_axis', unit: 'au', multi: 'properties' },
                                { name: 'orbital_period', format: val => Dates.formatDistance(strings, Dates.daysToMs(val), 0, Dates.Format.EXACT), multi: 'properties' },
                                { name: 'orbital_velocity', unit: <Fraction top='km' bottom='s' />, multi: 'properties' },
                                { name: 'transit_depth', format: (_, planet) => planet.properties[0]?.transit?.local_view && <Curve data={planet.properties[0].transit.local_view as any} simple={true} type={Curve.LV} />, title: <Colored color='#AFA'>{strings.planets.transit}</Colored>, width: '20rem' },
                                { name: 'life_conditions', format: val => strings.planets.lifeConditionsTypes[val], styleMap: lifeTypeStyle, multi: 'properties' },
                                { name: 'surface_gravity', unit: <Fraction top='m' bottom={<>s<sup>2</sup></>}/>, multi: 'properties' },
                                { name: 'stat   us', format: value => strings.planets.statuses[value], styleMap: planetStatusStyle },
                                { name: 'todo' },
                                { name: 'todo' },
                                { name: 'todo' },
                                { name: 'dataset', format: (val, planet, i) => <IconText text={val} icon={`/img/Database/Dataset/${(planet as any).processed ? 'TargetPixel' : 'PlanetProperties'}.svg`} />, width: 1.5, multi: 'properties' }
                            ], {
                                strings: planets
                            })
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

                                { name: 'planets', format: (val, item) => <Diff {...item.stats.planets} /> },
                                { name: 'data', format: (val, item) => <ProgressBar range={item.size} value={[item.stats.items.value, item.stats.items.value - item.stats.items.diff]} label={<Diff {...item.stats.data} format={val => Units.format(val, UnitType.MEMORY)} />} title={`${Numbers.format(item.stats.items.value)} / ${Numbers.format(item.size)}`} />, width: 1.5 },
                                { name: 'time', format: (val, item) => <Diff {...item.stats.time} format={val => Units.format(val, UnitType.TIME)} />},

                                { name: 'size', format: Numbers.format },
                                { name: 'created', format: val => <DateTime s={val} />, title: strings.datasets.published },
                                { name: 'modified', format: val => Dates.formatDistance(strings, val) },
                                { name: 'priority', format: val => strings.datasets.priorities[val], styleMap: priorityStyle },
                                { icon: true, title: 'URL', name: 'items_getter', format: (val, item) => <OptionalLine lines={[item.items_getter, item.item_getter]} format={url => <TextLink pathname={url as string}>{Urls.parse(url as string).hostname}</TextLink>} />, width: 1.75     }
                            ], {
                                strings: datasets,
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
            case DbTable.USERS:
                return {
                    levels: [
                        {
                            columns: Col.list<User>([
                                { name: 'role', format: (val, item) => <Avatar user={item} size='3.5rem' />, width: '5rem', headerIcon: false },
                                { name: 'name', format: (val, item) => <Detail title={val} subtitle={strings.users.roles[item.role]} />, width: 1.5, headerIcon: false },
                                { name: 'planets', format: (val, item) => <Diff {...item.stats.planets} /> },
                                { name: 'items', format: (val, item) => <Diff {...item.stats.items} /> },
                                { name: 'data', format: (val, item) => <Diff {...item.stats.data} format={val => Units.format(val, UnitType.MEMORY)}  /> },
                                { name: 'time', format: (val, item) => <Diff {...item.stats.time} format={val => Units.format(val, UnitType.TIME)} />},
                                { name: 'created', format: (val, user) => <DateTime s={val} /> },
                                { name: 'modified', format: (val, user) => Dates.formatDistance(strings, val) },
                                { name: 'country', format: (val, user) => user.personal.country && (Countries.countryCode(user.personal.country).emoji + ' ' + user.personal.country) },
                                { name: 'sex', format: (val, user) => user.personal.sex && <IconText icon={`User/${user.personal.sex === Sex.FEMALE ? 'Female' : 'Male'}.svg`} text={users.sexName[user.personal.sex!]} /> },
                                { name: 'birth', title: users.age, format: (val, user) => user.personal.birth && Dates.formatDistance(strings, user.personal.birth) },
                                { name: 'contact', format: (val, user) => <TextLink pathname={user.personal.contact}>{user.personal.contact}</TextLink>, width: 1.75 },
                            ], {
                                strings: users,
                                indexColumnName: 'index'
                            })
                        }
                    ],
                    getter: getUsers,
                    rowHeight: () => 72
                }
        }

        return null as any
    }, [table, strings, dispatch, datasets, planets, stars, users])
}

interface ColoredProps {
    color: string
}

const Colored = Styled.span<ColoredProps>`
    color: ${props => props.color};
    `

interface ItemImageProps {
    large?: boolean
    image: string
}

const ItemImage = Styled.div<ItemImageProps>`
    ${props => size(props.large ? '4rem' : '2.5rem')}
    
    ${props => props.image.startsWith('http') ? css`
        ${image()}
        background-image: url(${props.image});
    ` : css`
        ${image(props.image)}
    `}
    display: inline-block
`

export default UseTableColumns