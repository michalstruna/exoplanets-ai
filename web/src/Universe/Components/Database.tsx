import React from 'react'
import Styled from 'styled-components'
import { Dimensions, Mixin } from '../../Utils'
import SpectralType from '../Constants/SpectralType'
import { Planet } from '../types'
import HierarchicalTable from './HierarchicalTable'
import MiniGraph from './MiniGraph'

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
        height: 5rem;
        
        &:first-of-type {
            padding-right: 0;
            text-align: right;
            width: auto;
        }
    
        &:nth-of-type(2) {
            width: 14rem;
        }
        
        &:nth-of-type(10) {
            width: 20rem;
            
            &:not([data-header])[data-level="0"] {
                padding-left: 0;
                padding-right: 0;
            }
        }
        
        &[data-level="1"] {
            height: 3.5rem;
        
            &:first-of-type {
                margin-left: 3rem;
            }
            
            &:nth-of-type(2) {
                width: 12.5rem;
            }
        }
        
        &[data-header] {
            height: 2.5rem;
            padding-bottom: 0;
        
            &[data-level="0"] {
                &:nth-of-type(2) {
                    width: 15.5rem;
                }
            
                ${Image} {
                    ${Mixin.Size('2.5rem')}
                }
            }
            
            &[data-level="1"] {
                height: 2rem;
                padding-bottom: 0.25rem;
                padding-top: 0;
            
                &:nth-of-type(2) {
                    width: 13.5rem;
                }
            
                ${Image} {
                    ${Mixin.Size('1.5rem')}
                }
            }
        }
    }
`

const data = []

for (let i = 0; i < 20; i++) {
    data.push({
        name: 'VY Canis Majoris',
        mass: 1.28,
        diameter: 2.36,
        temperature: '5536 K',
        luminosity: 128,
        absoluteMagnitude: 12,
        color: '#FFAA00',
        spectralClass: SpectralType.A,
        transit: [100, 100, 99.8, 99.2, 99.3, 99.9, 100, 100, 100, 100, 99.6, 99.3],
        radialVelocity: [60, 61.3, 62.4, 63, 62.9, 62.4, 61.5, 60.2, 60.2, 61, 62.2, 62.3],
        planets: new Array(0).fill({
            diameter: 12475,
            mass: 1234,
            surfaceTemperature: '128 °C',
            orbitalPeriod: 1234,
            semiMajorAxis: 123456,
            orbitalVelocity: 72,
            density: 1154,
            type: 1
        }),
        type: Math.floor(Math.random() * 5),
        distance: 5
    })
}

const starColumns = [
    { title: <Image />, accessor: star => star.type, render: () => <Image /> },
    {
        title: 'Hvězda',
        accessor: star => star.name,
        render: (name, star) => <>{name}<br />{'Žlutý trpaslík M5,5Ve'}</>
    },
    {
        title: 'Průměr',
        accessor: star => star.diameter,
        icon: '/img/Universe/Database/Diameter.svg',
        render: () => '1,98G km'
    },
    { title: 'Hmotnost', accessor: star => star.mass, icon: '/img/Universe/Database/Mass.svg' },
    { title: 'Teplota', accessor: star => star.temperature, icon: '/img/Universe/Database/Temperature.svg' },
    { title: 'Zářivý výkon', accessor: star => star.luminosity, icon: '/img/Universe/Database/Luminosity.svg' },
    { title: 'Vzdálenost', accessor: star => star.distance, icon: '/img/Universe/Database/Distance.svg' },
    { title: 'Planet', accessor: star => star.planets.length, icon: '/img/Universe/Database/Planet.svg' },
    { title: '', accessor: star => star.planets.length, icon: '', render: value => '' },
    {
        title: 'Pozorování',
        accessor: () => null,
        render: (value, star) => <MiniGraph data={star} left='transit' right='radialVelocity' />,
        headerIcon: '/img/Universe/Database/Discovery.svg'
    }
]

const planetColumns = [
    { title: <PlanetImage />, accessor: planet => planet.type, render: () => <PlanetImage /> },
    { title: 'Planeta', accessor: planet => planet.type, render: () => 'Horký jupiter' },
    { title: 'Průměr', accessor: planet => planet.diameter, icon: '/img/Universe/Database/Diameter.svg' },
    { title: 'Hmotnost', accessor: planet => planet.mass, icon: '/img/Universe/Database/Mass.svg' },
    { title: 'Teplota', accessor: planet => planet.surfaceTemperature, icon: '/img/Universe/Database/Temperature.svg' },
    { title: 'Perioda', accessor: planet => planet.orbitalPeriod, icon: '/img/Universe/Database/Period.svg' },
    { title: 'Poloosa', accessor: planet => planet.semiMajorAxis, icon: '/img/Universe/Database/Orbit.svg' },
    { title: 'Rychlost', accessor: planet => planet.orbitalVelocity, icon: '/img/Universe/Database/Velocity.svg' },
    { title: 'Život', accessor: () => 'Vyloučen', icon: '/img/Universe/Database/Life.svg' },
    {
        title: 'Metoda',
        accessor: () => null,
        render: () => <>Tranzit<br />Radiální rychlost</>,
        icon: '/img/Universe/Database/Discovery.svg'
    }
]

const Database: React.FC<Props> & Static = ({ ...props }) => {

    return (
        <Table
            items={data}
            levels={[
                { columns: starColumns },
                { columns: planetColumns, accessor: star => star.planets }
            ]} />
    )

}

export default Database