import React from 'react'
import Styled from 'styled-components'
import { bindActionCreators } from 'redux'
import { useDispatch } from 'react-redux'

import { Dimensions, Mixin, Validator } from '../../Utils'
import { Planet } from '../types'
import HierarchicalTable from './HierarchicalTable'
import MiniGraph from './MiniGraph'
import { Query } from '../../Routing'
import { useBodies, getBodies, useBodiesFilter, useBodiesSort, setBodiesSort } from '..'
import { Async } from '../../Async'

interface Static {

}

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

const Root = Styled.div`
    height: calc(100% - ${Dimensions.NAV_HEIGHT});
    width: 100%;
`

const colors = ['#A50', '#FFF', '#A00', '#CC0']

const Image = Styled.div`
    ${Mixin.Size('4rem')}
    background-image: radial-gradient(${colors[3]}, #000);
    border-radius: 100%;
    display: inline-block;
`

const PlanetImage = Styled(Image)`
    ${Mixin.Size('2.5rem')}
    background-image: radial-gradient(#CA0, #000);
`

const Table = Styled(HierarchicalTable)`
    ${HierarchicalTable.Cell} {
        height: 6rem;
        
        &:first-of-type {
            padding-right: 0;
            text-align: right;
        }
    
        &:nth-of-type(2) {
            width: 16.5rem;
        }
        
        &:nth-of-type(6) {
            width: 11rem;
        }
        
        &:nth-of-type(10) {
            width: 22rem;
            
            &:not([data-header])[data-level="0"] {
                padding-left: 0;
                padding-right: 0;
            }
        }
        
        &[data-level="0"] {
            &:first-of-type {
                width: 5rem;
            }
        }
        
        &[data-level="1"] {
            height: 4.5rem;
        
            &:first-of-type {
                padding-left: 4rem;
                width: 7rem;
            }
            
            &:nth-of-type(2) {
                width: 14.5rem;
            }
        }
        
        &[data-header] {
            height: 3rem;
            padding-top: 0;
            padding-bottom: 0;
        
            &[data-level="0"] {                            
                &:nth-of-type(2) {
                    width: 16.5rem;
                }
            
                ${Image} {
                    ${Mixin.Size('2.5rem')}
                }
            }
            
            &[data-level="1"] {
                height: 2rem;
            
                &:nth-of-type(2) {
                    width: 14.5rem;
                }
            
                ${Image} {
                    ${Mixin.Size('1.5rem')}
                }
            }
        }
    }
`

interface Colored {
    color: string
}

const Colored = Styled.span<Colored>`
    color: ${props => props.color};
`

const lines = ['transit', 'radialVelocity']
const labels = ['Tranzit [%]', 'Radiální rychlost [m/s]']

const starColumns = [
    { id: 'type', title: <Image />, accessor: star => star.type, render: () => <Image /> },
    {
        id: 'name',
        title: 'Hvězda',
        accessor: star => star.name,
        render: (name, star) => <>{name}<br />{'Žlutý trpaslík M5,5Ve'}</>
    },
    {
        id: 'diameter',
        title: 'Průměr',
        accessor: star => star.diameter,
        icon: '/img/Universe/Database/Diameter.svg',
        render: v => v + ' km'
    },
    { id: 'mass', title: 'Hmotnost', accessor: star => star.mass, icon: '/img/Universe/Database/Mass.svg' },
    {
        id: 'temperature',
        title: 'Teplota',
        accessor: star => star.temperature,
        icon: '/img/Universe/Database/Temperature.svg'
    },
    {
        id: 'luminosity',
        title: 'Zářivý výkon',
        accessor: star => star.luminosity,
        icon: '/img/Universe/Database/Luminosity.svg'
    },
    {
        id: 'distance',
        title: 'Vzdálenost',
        accessor: star => star.distance,
        icon: '/img/Universe/Database/Distance.svg'
    },
    {
        id: 'planets.length',
        title: 'Planet',
        accessor: star => star.planets.length,
        icon: '/img/Universe/Database/Planet.svg'
    },
    { id: 'planets.length', title: '', accessor: star => star.planets.length, icon: '', render: value => '' },
    {
        title: <><Colored color='#77CC77'>Tranzit [%]</Colored>&nbsp;/&nbsp; <Colored color='#CC7777'>radiální
            rychlost [m/s]</Colored></>,
        accessor: () => null,
        render: (value, star) => <MiniGraph data={star.tmp} lines={lines} labels={labels} height={80} width={320} />,
        headerIcon: '/img/Universe/Database/Discovery.svg'
    }
]

const planetColumns = [
    { id: 'type', title: <PlanetImage />, accessor: planet => planet.type, render: () => <PlanetImage /> },
    { id: 'type', title: 'Planeta', accessor: planet => planet.type, render: () => 'Horký jupiter' },
    {
        id: 'diameter',
        title: 'Průměr',
        accessor: planet => planet.diameter,
        icon: '/img/Universe/Database/Diameter.svg'
    },
    { id: 'mass', title: 'Hmotnost', accessor: planet => planet.mass, icon: '/img/Universe/Database/Mass.svg' },
    {
        id: 'surfaceTemperature',
        title: 'Teplota',
        accessor: planet => planet.surfaceTemperature,
        icon: '/img/Universe/Database/Temperature.svg'
    },
    {
        id: 'orbitalPeriod',
        title: 'Perioda',
        accessor: planet => planet.orbitalPeriod,
        icon: '/img/Universe/Database/Period.svg'
    },
    {
        id: 'semiMajorAxis',
        title: 'Poloosa',
        accessor: planet => planet.semiMajorAxis,
        icon: '/img/Universe/Database/Orbit.svg'
    },
    {
        id: 'orbitalVelocity',
        title: 'Rychlost',
        accessor: planet => planet.orbitalVelocity,
        icon: '/img/Universe/Database/Velocity.svg'
    },
    { id: '', title: 'Život', accessor: () => 'Vyloučen', icon: '/img/Universe/Database/Life.svg' },
    {
        id: '',
        title: 'Metoda',
        accessor: () => null,
        render: () => <>Tranzit<br />Radiální rychlost</>,
        icon: '/img/Universe/Database/Discovery.svg'
    }
]

const levels = [
    { columns: starColumns },
    { columns: planetColumns, accessor: star => star.planets }
]

const queryUtils = new URLSearchParams(window.location.search)

const defaultLevel = Validator.safe(parseInt(queryUtils.get(Query.ORDER_LEVEL)), v => Number.isInteger(v) && v >= 0 && v < levels.length, 0)

const defaultSort = {
    column: Validator.safe(parseInt(queryUtils.get(Query.ORDER_COLUMN)), v => Number.isInteger(v) && v >= 0 && v < levels[defaultLevel].columns.length, 0),
    isAsc: Validator.safe(parseInt(queryUtils.get(Query.ORDER_IS_ASC)), v => v === 1 || v === 0, 1) === 1,
    level: defaultLevel
}

const Database: React.FC<Props> & Static = ({ ...props }) => {

    const bodies = useBodies()
    const filter = useBodiesFilter()
    const sort = useBodiesSort()
    const actions = bindActionCreators({ setBodiesSort }, useDispatch())

    const handleSort = newSort => {
        if (newSort.column !== sort.column || newSort.isAsc !== sort.isAsc || newSort.level !== sort.level) {
            actions.setBodiesSort(newSort)
        }
    }

    return (
        <Table
            items={bodies.payload || []}
            levels={levels}
            onSort={handleSort}
            defaultSort={defaultSort}
            renderBody={body => (
                <Async
                    data={[bodies, () => getBodies({ sort, filter }), [sort, filter]]}
                    success={() => body} />
            )} />
    )

}

export default Database