import React from 'react'
import Styled from 'styled-components'
import Url from 'url'
import prettyBytes from 'pretty-bytes'

import DbTable from '../Constants/DbTable'
import { Cursor, Fraction, Level } from '../../Layout'
import { MiniGraph } from '../../Stats'
import { image, size } from '../../Style'
import ItemControls from '../Components/ItemControls'
import { Link } from '../../Routing'
import { getBodies, getStars, getDatasets } from '../Redux/Slice'
import { Dates, Numbers } from '../../Native'
import ProgressBar from '../../Layout/Components/ProgressBar'

const Detail = Styled(Link)`
    ${size()}
    align-items: center;
    display: flex;

    &:after {   
        ${image('Controls/ArrowRight.svg', '80%')}
        ${size('1rem')}
        content: "";
        display: inline-block;
        margin-left: 0.5rem;
        vertical-align: middle;
    }
`

const SpectralClassRoot = Styled.div`
    display: inline-block;
    font-weight: bold;
`

const SpectralClass = ({ temperature }: { temperature: number }) => (
    <SpectralClassRoot style={{ color: `#A00` }}>
        O
    </SpectralClassRoot>
)

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

const MultiValue = ({ items, property, formatter = val => val }: { items: any[], property: string, formatter?: (val: any) => any }) => (
    <div>
        {items.filter(item => !!item[property]).map(item => <div>{formatter(item[property])}</div>)}
    </div>
)

const priorityColor = ['#666', '#888', '#EEE', '#EAA', '#F55']

const Priority = ({ value, label }: { value: number, label: string }) => (
    <div style={{ fontWeight: value > 3 ? 'bold' : undefined, color: priorityColor[value - 1] }}>
        {label}
    </div>
)

// TODO: Hooks instaed providers?
// TODO: Root strings in parameter.
export const provideFilterColumns = (table: DbTable, strings: any): [string, string][] => {
    switch (table) {
        case DbTable.BODIES:
            return []
        case DbTable.STARS:
            return []
        case DbTable.DATASETS:
            return [
                ['name', strings.name],
                ['type', strings.type],
                ['total_size', strings.objects],
                ['processed', strings.processed],
                ['time', strings.processTime],
                ['created', strings.published],
                ['modified', strings.lastActivity],
                ['priority', strings.priority],
                ['url', strings.url]
            ]
    }

    return []
}

type Structure = {
    levels: Level[]
    getter: (cursor: Cursor) => void
    rowHeight: (row: number, level: number) => number
}

export const provideStructure = (table: DbTable, strings: any): Structure => {
    switch (table) {
        case DbTable.BODIES:
            return {
                levels: [
                    {
                        columns: [
                            {
                                title: '#',
                                accessor: (star: any) => star.index + 1,
                                render: (index: any) => index || '',
                                width: '3rem'
                            },
                            {
                                title: <Image />,
                                accessor: (star: any) => star.type,
                                render: () => <Image />,
                                width: '5rem'
                            },
                            {
                                title: 'Hvězda',
                                accessor: (star: any) => star.name,
                                render: (name: any, star: any) => <>{name}<br />{'Žlutý trpaslík M5,5Ve'}</>,
                                width: '16.5rem'
                            },
                            {
                                title: 'Průměr',
                                accessor: (star: any) => star.diameter,
                                icon: '/img/Universe/Database/Diameter.svg',
                                render: (v: any) => <>{v} km<br />{v} km<br />{v} km</>
                            },
                            {
                                title: 'Hmotnost',
                                accessor: (star: any) => star.mass,
                                icon: '/img/Universe/Database/Mass.svg'
                            },
                            {
                                title: 'Teplota',
                                accessor: (star: any) => star.temperature,
                                icon: '/img/Universe/Database/Temperature.svg'
                            },
                            {
                                title: 'Zářivý výkon',
                                accessor: (star: any) => star.luminosity,
                                icon: '/img/Universe/Database/Luminosity.svg'
                            },
                            {
                                title: 'Vzdálenost',
                                accessor: (star: any) => star.distance,
                                icon: '/img/Universe/Database/Distance.svg'
                            },
                            {
                                title: 'Planet',
                                accessor: (star: any) => star.planets.length,
                                icon: '/img/Universe/Database/Planet.svg'
                            },
                            {
                                title: '',
                                accessor: (star: any) => star.planets.length,
                                icon: '',
                                render: (value: any) => ''
                            },
                            {
                                title: <><Colored color='#77CC77'>Tranzit [%]</Colored>&nbsp;/&nbsp; <Colored
                                    color='#CC7777'>radiální rychlost [m/s]</Colored></>,
                                accessor: () => '',
                                render: (value: any, star: any) => <MiniGraph data={star.tmp} lines={lines}
                                                                              labels={labels} height={80}
                                                                              width={320} />,
                                headerIcon: '/img/Universe/Database/Discovery.svg',
                                width: '20rem'
                            }
                        ]
                    },
                    {
                        columns: [
                            {
                                title: '',
                                accessor: (planet: any) => planet.index + 1,
                                render: (index: any) => index || '',
                                width: '4rem'
                            },
                            {
                                title: <PlanetImage />,
                                accessor: (planet: any) => planet.type,
                                render: () => <PlanetImage />,
                                width: '6rem'
                            },
                            {
                                title: 'Planeta',
                                accessor: (planet: any) => planet.type,
                                render: () => 'Horký jupiter',
                                width: '16.5rem'
                            },
                            {
                                title: 'Průměr',
                                accessor: (planet: any) => planet.diameter,
                                icon: '/img/Universe/Database/Diameter.svg'
                            },
                            {
                                title: 'Hmotnost',
                                accessor: (planet: any) => planet.mass,
                                icon: '/img/Universe/Database/Mass.svg'
                            },
                            {
                                title: 'Teplota',
                                accessor: (planet: any) => planet.surfaceTemperature,
                                icon: '/img/Universe/Database/Temperature.svg'
                            },
                            {
                                title: 'Perioda',
                                accessor: (planet: any) => planet.orbitalPeriod,
                                icon: '/img/Universe/Database/Period.svg'
                            },
                            {
                                title: 'Poloosa',
                                accessor: (planet: any) => planet.semiMajorAxis,
                                icon: '/img/Universe/Database/Orbit.svg'
                            },
                            {
                                title: 'Rychlost',
                                accessor: (planet: any) => planet.orbitalVelocity,
                                icon: '/img/Universe/Database/Velocity.svg'
                            },
                            { title: 'Život', accessor: () => 'Vyloučen', icon: '/img/Universe/Database/Life.svg' },
                            {
                                title: 'Metoda',
                                accessor: () => '',
                                render: () => <>Tranzit<br />Radiální rychlost</>,
                                icon: '/img/Universe/Database/Discovery.svg',
                                width: '20rem'
                            }
                        ],
                        accessor: (star: any) => star.planets
                    }
                ],
                getter: getBodies,
                rowHeight: (index, level) => level === 0 ? 96 : 72
            }
        case DbTable.STARS:
            return {
                levels: [
                    {
                        columns: [
                            { title: '#', accessor: (dataset, i) => i + 1, width: '3rem' },
                            {
                                title: <Image />,
                                accessor: dataset => dataset.type,
                                render: () => <Image />,
                                width: '5rem'
                            },
                            {
                                title: strings.properties.name,
                                accessor: star => star.properties[0].name,
                                render: (name, star) => <Detail pathname='/abc'>
                                    <div><b>{name}</b><br /><i>{strings.stars.types.YELLOW_DWARF}</i></div>
                                </Detail>,
                                width: 1.5,
                                interactive: true
                            },
                            {
                                title: strings.properties.diameter,
                                accessor: star => star.properties[0].diameter,
                                render: (diameter, star) => <MultiValue items={star.properties} property='diameter' formatter={val => Numbers.format(val) + ' ☉'} />,
                                icon: '/img/Universe/Database/Diameter.svg'
                            },
                            {
                                title: strings.properties.mass,
                                accessor: star => star.properties[0].mass,
                                render: (mass, star) => <MultiValue items={star.properties} property='mass' formatter={val => Numbers.format(val) + ' ☉'} />,
                                icon: '/img/Universe/Database/Mass.svg'
                            },
                            {
                                title: strings.properties.temperature,
                                accessor: star => star.properties[0].temperature,
                                render: (_, star) => <MultiValue items={star.properties} property='temperature' formatter={val => <>{Numbers.format(val)} K (<SpectralClass temperature={val} />)</>} />,
                                icon: '/img/Universe/Database/Temperature.svg'
                            },
                            {
                                title: strings.properties.luminosity,
                                accessor: star => star.properties[0].luminosity,
                                render: (_, star) => <MultiValue items={star.properties} property='luminosity' formatter={val => Numbers.format(val) + ' ☉'} />,
                                icon: '/img/Universe/Database/Luminosity.svg'
                            },
                            {
                                title: strings.properties.density,
                                accessor: star => star.properties[0].density,
                                render: (_, star) => <MultiValue items={star.properties} property='density' formatter={val => <>{Numbers.format(val)} <Fraction top='kg' bottom={<>m<sup>3</sup></>}/></>} />,
                                icon: '/img/Universe/Database/Density.svg'
                            },
                            {
                                title: strings.properties.distance,
                                accessor: star => star.properties[0].distance,
                                render: distance => Numbers.format(distance) + ' ly',
                                icon: '/img/Universe/Database/Distance.svg'
                            },
                            {
                                title: strings.properties.gravity,
                                accessor: star => star.properties[0].gravity,
                                render: (_, star) => <MultiValue items={star.properties} property='gravity' formatter={val => <>{Numbers.format(val)} <Fraction top='m' bottom={<>s<sup>2</sup></>}/></>} />,
                                icon: '/img/Universe/Database/Gravity.svg'
                            },
                            {
                                title: strings.properties.planets,
                                accessor: star => star.planets,
                                render: () => 3,
                                icon: '/img/Universe/Database/Planet.svg'
                            },
                            {
                                title: strings.properties.datasets,
                                accessor: star => star.properties.length, // TODO: Light curve
                                render: (_, star) => <MultiValue items={star.properties} property='dataset' />,
                                icon: '/img/Universe/Database/Datasets.svg',
                                width: 1.5
                            },
                            {
                                title: '',
                                accessor: () => '',
                                render: () => <ItemControls onEdit={() => null} onRemove={() => null} />,
                                width: 1.5
                            }
                        ]
                    }
                ],
                getter: getStars,
                rowHeight: () => 96
            }
        case DbTable.DATASETS:
            return {
                levels: [
                    {
                        columns: [
                            { title: '#', accessor: (dataset, i) => i + 1, width: '3rem' },
                            {
                                title: <PlanetImage />,
                                accessor: dataset => dataset.type,
                                render: () => <PlanetImage />,
                                width: '4rem'
                            },
                            {
                                title: strings.properties.name,
                                accessor: dataset => dataset.name,
                                render: (name, dataset) => <Detail pathname='/abc'>
                                    <div><b>{name}</b><br /><i>{strings.datasets.types[dataset.type]}</i></div>
                                </Detail>,
                                width: 1.5,
                                interactive: true
                            },
                            {
                                title: strings.properties.objects,
                                accessor: dataset => Numbers.format(dataset.total_size)
                            },
                            {
                                title: strings.properties.processed,
                                accessor: dataset => 100 - Math.floor(10000 * dataset.current_size / dataset.total_size) / 100,
                                render: (processed, dataset) => <ProgressBar range={dataset.total_size}
                                                                             value={dataset.total_size - dataset.current_size}
                                                                             label={prettyBytes(dataset.processed || 0)} />
                            },
                            {
                                title: strings.properties.processTime,
                                accessor: dataset => dataset.time,
                                render: time => Dates.formatDistance(strings, 0, time, true)
                            },
                            {
                                title: strings.properties.published,
                                accessor: dataset => dataset.created,
                                render: created => <DateTime s={created} />
                            },
                            {
                                title: strings.properties.lastActivity,
                                accessor: dataset => dataset.modified,
                                render: modified => Dates.formatDistance(strings, modified)
                            },
                            {
                                title: strings.properties.priority,
                                accessor: dataset => dataset.priority,
                                render: priority => <Priority label={strings.datasets.priorities[priority - 1]}
                                                              value={priority} />
                            },
                            {
                                title: strings.properties.url,
                                accessor: dataset => (dataset.items_getter || '') + (dataset.item_getter || ''),
                                render: (val, dataset) => <OptionalLine
                                    lines={[Url.parse(dataset.items_getter || '').hostname, Url.parse(dataset.item_getter || '').hostname]} />,
                                width: 2
                            },
                            {
                                title: '',
                                accessor: () => '',
                                render: () => <ItemControls onEdit={() => null} onRemove={() => null} />,
                                width: 1.5
                            }
                        ]
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


const colors = ['#A50', '#FFF', '#A00', '#CC0']

const Image = Styled.div.attrs({ className: 'image--star' })`
    ${size('4rem')}
    background-image: radial-gradient(${colors[3]}, #000);
    border-radius: 100%;
    display: inline-block;
`

const PlanetImage = Styled(Image)`
    ${size('2.5rem')}
    background-image: radial-gradient(#CA0, #000);
`

const lines = ['transit', 'radialVelocity']
const labels = ['Tranzit [%]', 'Radiální rychlost [m/s]']