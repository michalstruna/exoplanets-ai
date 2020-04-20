import React from 'react'
import Styled from 'styled-components'

import { Mixin, useActions, useDrag, useElement, ZIndex } from '../../Utils'
import { Planet } from '../types'
import { HierarchicalTable, MiniGraph } from '../../Data'
import { useBodies, getBodies, useBodiesFilter, useBodiesSort, setBodiesSort, useBodiesSegment } from '..'
import { Async } from '../../Async'

interface Static {

}

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

const Root = Styled.div`
    user-select: none;
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
    ${HierarchicalTable.Row} {
        &[data-is-odd="true"] {
            ${HierarchicalTable.Cell}:nth-of-type(3):not([data-header]) {
                background-color: #2F2F2F;
            }
        }
    
        &[data-is-odd="false"] {
            ${HierarchicalTable.Cell}:nth-of-type(3):not([data-header]) {
                background-color: #383838;
            }
        }
    }

    ${HierarchicalTable.Cell} {
        height: 6rem;
        
        &:first-of-type {
            font-size: 85%;
            pointer-events: none;
            width: 3rem;
        }
        
        &:nth-of-type(2) {
            padding-right: 0;
            position: relative;
            text-align: right;
            z-index: ${ZIndex.TABLE_BODY_ICON};
        }
    
        &:nth-of-type(3) {
            border-right: 2px solid black;
            left: 0;
            position: sticky;
            width: 16.5rem;
            z-index: ${ZIndex.TABLE_BODY_NAME};
        }
        
        &:nth-of-type(7) {
            width: 11rem;
        }
        
        &:nth-of-type(11) {
            width: 22rem;
            
            &:not([data-header])[data-level="0"] {
                padding-left: 0;
                padding-right: 0;
            }
        }
        
        &[data-level="0"] {
            &:nth-of-type(2) {
                width: 5rem;
            }
        }
        
        &[data-level="1"] {
            height: 4.5rem;
        
            &:nth-of-type(2) {
                padding-left: 4rem;
                width: 7rem;
            }
            
            &:nth-of-type(3) {
                margin-left: -2rem;
                padding-left: 3rem;
            }
        }
        
        &[data-header] {
            height: 3rem;
            padding-top: 0;
            padding-bottom: 0;
        
            &[data-level="0"] {                            
                ${Image} {
                    ${Mixin.Size('2.5rem')}
                }
                
                &:first-of-type {
                    font-size: 110%;
                    transform: translateY(30%);
                }
            }
            
            &[data-level="1"] {
                height: 2rem;
            
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
    { title: '#', accessor: (star: any) => star.index + 1, render: (index: any) => index || '' },
    { title: <Image />, accessor: (star: any) => star.type, render: () => <Image /> },
    {
        title: 'Hvězda',
        accessor: (star: any) => star.name,
        render: (name: any, star: any) => <>{name}<br />{'Žlutý trpaslík M5,5Ve'}</>
    },
    {
        title: 'Průměr',
        accessor: (star: any) => star.diameter,
        icon: '/img/Universe/Database/Diameter.svg',
        render: (v: any) => v + ' km'
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
        title: <><Colored color='#77CC77'>Tranzit [%]</Colored>&nbsp;/&nbsp; <Colored color='#CC7777'>radiální
            rychlost [m/s]</Colored></>,
        accessor: () => null,
        render: (value: any, star: any) => <MiniGraph data={star.tmp} lines={lines} labels={labels} height={80} width={320} />,
        headerIcon: '/img/Universe/Database/Discovery.svg'
    }
]

const planetColumns = [
    { title: '', accessor: (planet: any) => planet.index + 1, render: (index: any) => index || '' },
    { title: <PlanetImage />, accessor: (planet: any) => planet.type, render: () => <PlanetImage /> },
    { title: 'Planeta', accessor: (planet: any) => planet.type, render: () => 'Horký jupiter' },
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
        accessor: () => null,
        render: () => <>Tranzit<br />Radiální rychlost</>,
        icon: '/img/Universe/Database/Discovery.svg'
    }
]

const levels = [
    { columns: starColumns },
    { columns: planetColumns, accessor: (star: any) => star.planets }
]

const Database: React.FC<Props> & Static = ({ ...props }) => {

    const bodies = useBodies()
    const filter = useBodiesFilter()
    const sort = useBodiesSort()
    const actions = useActions({ getBodies, setBodiesSort })

    const segment = useBodiesSegment()
    const { app } = useElement()

    const dragHandlers = useDrag(({ delta, data }) => {
        if (!app.current) {
            return null
        }

        app.current.scrollLeft = data.x - delta.x
        app.current.scrollTop = data.y - delta.y
    }, () => ({ x: app.current ? app.current.scrollLeft : 0, y: app.current ? app.current.scrollTop : 0 }))

    const handleSort = (newSort: any) => {
        if (newSort.column !== sort.column || newSort.isAsc !== sort.isAsc || newSort.level !== sort.level) {
            actions.setBodiesSort(newSort)
        }
    }

    return (
        <Root {...props} {...dragHandlers}>
            <Table
                items={bodies.payload ? bodies.payload.list : []}
                levels={levels as any}
                onSort={handleSort}
                defaultSort={sort}
                renderBody={body => (
                    <Async
                        data={[bodies, () => getBodies({ sort, filter, segment }), [sort, filter, segment]]}
                        success={() => body} />
                )} />
        </Root>
    )

}

export default Database