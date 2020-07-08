
import React from 'react'
import Styled from 'styled-components'

import DbTable from '../Constants/DbTable'
import { Level } from '../../Layout'
import { MiniGraph } from '../../Stats'
import { image, size } from '../../Style'
import ItemControls from '../Components/ItemControls'
import { Link } from '../../Routing'

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

export const provideFilterColumns = (table: DbTable, strings: any): [string, string][] => {
    switch (table) {
        case DbTable.STARS_AND_PLANETS:
            return []
        case DbTable.DATASETS:
            return [
                ['name', 'Název'],
                ['total_size', 'Total size'],
                ['processed', 'Zpracováno'],
                ['type', 'Typ'],
                ['date', 'Datum']
            ]
    }

    return []
}

type Structure = {
    levels: Level[]
    getter: () => void
    selector: () => any[]
    rowHeight: (row: number, level: number) => number
}

export const providedStructure = (table: DbTable, strings: any): Structure => {
    switch (table) {
        case DbTable.STARS_AND_PLANETS:
            return {
                levels: [
                    {
                        columns: [
                            { title: '#', accessor: (star: any) => star.index + 1, render: (index: any) => index || '', width: '3rem' },
                            { title: <Image />, accessor: (star: any) => star.type, render: () => <Image />, width: '5rem' },
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
                            { title: 'Hmotnost', accessor: (star: any) => star.mass, icon: '/img/Universe/Database/Mass.svg' },
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
                            { title: '', accessor: (star: any) => star.planets.length, icon: '', render: (value: any) => '' },
                            {
                                title: <><Colored color='#77CC77'>Tranzit [%]</Colored>&nbsp;/&nbsp; <Colored color='#CC7777'>radiální rychlost [m/s]</Colored></>,
                                accessor: () => '',
                                render: (value: any, star: any) => <MiniGraph data={star.tmp} lines={lines} labels={labels} height={80} width={320} />,
                                headerIcon: '/img/Universe/Database/Discovery.svg',
                                width: '20rem'
                            }
                        ]
                    },
                    {
                        columns: [
                            { title: '', accessor: (planet: any) => planet.index + 1, render: (index: any) => index || '', width: '4rem' },
                            { title: <PlanetImage />, accessor: (planet: any) => planet.type, render: () => <PlanetImage />, width: '6rem' },
                            { title: 'Planeta', accessor: (planet: any) => planet.type, render: () => 'Horký jupiter', width: '16.5rem' },
                            {
                                title: 'Průměr',
                                accessor: (planet: any) => planet.diameter,
                                icon: '/img/Universe/Database/Diameter.svg'
                            },
                            { title: 'Hmotnost', accessor: (planet: any) => planet.mass, icon: '/img/Universe/Database/Mass.svg' },
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
                getter: null as any,
                selector: null as any,
                rowHeight: (index, level) => level === 0 ? 96 : 72
            }
        case DbTable.DATASETS:
            return {
                levels: [
                    {
                        columns: [
                            { title: '#', accessor: (dataset, i) => i + 1, width: '3rem' },
                            { title: <PlanetImage />, accessor: (dataset: any) => '', render: () => <PlanetImage />, width: '5rem' },
                            {
                                title: 'Název',
                                accessor: dataset => dataset.name,
                                render: name => <Detail pathname='/abc'><div><b>{name}</b><br /><i>Svetelné křivky</i></div></Detail>,
                                width: 1.5,
                                interactive: true,
                            },
                            {
                                title: 'Objektů',
                                accessor: (dataset: any) => '203 100'
                            },
                            {
                                title: 'Zpracováno',
                                accessor: () => '',
                                render: () => <div>98.01 %<br /><i>37,8 GiB</i></div>
                            },
                            {
                                title: 'Výpočetní čas',
                                accessor: () => '12,05 h'
                            },
                            {
                                title: 'Zveřejnění',
                                accessor: () => '6. 7. 2020'
                            },
                            {
                                title: 'Dokončení',
                                accessor: () => ''
                            },
                            {
                                title: 'Aktivní',
                                accessor: () => '0'
                            },
                            {
                                title: 'URL',
                                accessor: () => 'exoplanetarchive.ipac.caltech.edu',
                                render: () => <>exoplanetarchive.ipac.caltech.edu<br />exoplanetarchive.ipac</>,
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
                selector: null as any,
                getter: null as any,
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