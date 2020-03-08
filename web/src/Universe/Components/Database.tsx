import React from 'react'
import Styled from 'styled-components'
import { Dimensions, Mixin } from '../../Utils'
import SpectralType from '../Constants/SpectralType'
import StarType from '../Constants/StarType'
import { Planet } from '../types'
import HierarchicalTable from './HierarchicalTable'

interface Static {

}

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

const Root = Styled.div`
    height: calc(100% - ${Dimensions.NAV_HEIGHT});
    width: 100%;
`

const colors = ['#FF0', '#FFF', '#9FF']

const Image = Styled.div`
    ${Mixin.Size('4rem')}
    background-image: radial-gradient(${props => colors[Math.floor(Math.random() * colors.length)]}, #000);
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
        
        &:nth-of-type(10), &:nth-of-type(11) {
            width: 14rem;
        }
    }
    
    ${HierarchicalTable.Header} {
        ${Image} {
            ${Mixin.Size('2.5rem')}
        }
        
        ${HierarchicalTable.Cell} {
            &:nth-of-type(2) {
                width: 15.5rem;
            }
        }
        
        ${HierarchicalTable.Secondary} {
            ${Image} {
                ${Mixin.Size('1.5rem')}
            }
            
            ${HierarchicalTable.Cell} {
                height: 2rem;
                padding-bottom: 0.25rem;
                padding-top: 0;
            
                &:nth-of-type(2) {
                    width: 13.5rem;
                }
            }
        }
        
        ${HierarchicalTable.Cell} {
            height: 2.5rem;
            padding-bottom: 0;
        }
    }
    
    ${HierarchicalTable.Secondary} {
        ${HierarchicalTable.Cell} {
            height: 3.5rem;
        
            &:first-of-type {
                margin-left: 3rem;
            }
            
            &:nth-of-type(2) {
                width: 12.5rem;
            }
        }
    }
`

const starColumns = [
    { title: <Image />, accessor: star => star.type, render: () => <Image /> },
    { title: 'Hvězda', accessor: star => star.name, render: (name, star) => <>{name}<br />{'Žlutý trpaslík M5,5Ve'}</> },
    { title: 'Průměr', accessor: star => star.diameter, icon: '/img/Universe/Database/Diameter.svg', render: () => '1,98G km' },
    { title: 'Hmotnost', accessor: star => star.mass, icon: '/img/Universe/Database/Mass.svg' },
    { title: 'Teplota', accessor: star => star.temperature, icon: '/img/Universe/Database/Temperature.svg' },
    { title: 'Zářivý výkon', accessor: star => star.luminosity, icon: '/img/Universe/Database/Luminosity.svg' },
    { title: 'Vzdálenost', accessor: star => star.distance, icon: '/img/Universe/Database/Distance.svg' },
    { title: 'Planet', accessor: star => star.planets.length, icon: '/img/Universe/Database/Planet.svg' },
    { title: '', accessor: star => star.planets.length, icon: '', render: value => '' },
    { title: 'Tranzit', accessor: () => null, render: () => '', icon: '/img/Universe/Database/Discovery.svg' },
    { title: 'Radiální rychlost', accessor: () => null, render: () => '', icon: '/img/Universe/Database/Discovery.svg' }
]

const planetColumns = [
    { title: <PlanetImage />, accessor: planet => planet.type, render: () => <PlanetImage /> },
    { title: 'Planeta', accessor: planet => planet.type, render: () => 'Horký jupiter' },
    { title: 'Průměr', accessor: planet => planet.diameter, icon: '/img/Universe/Database/Diameter.svg'  },
    { title: 'Hmotnost', accessor: planet => planet.mass, icon: '/img/Universe/Database/Mass.svg' },
    { title: 'Teplota', accessor: planet => planet.surfaceTemperature, icon: '/img/Universe/Database/Temperature.svg' },
    { title: 'Perioda', accessor: planet => planet.orbitalPeriod, icon: '/img/Universe/Database/Period.svg' },
    { title: 'Poloosa', accessor: planet => planet.semiMajorAxis, icon: '/img/Universe/Database/Orbit.svg' },
    { title: 'Rychlost', accessor: planet => planet.orbitalVelocity, icon: '/img/Universe/Database/Velocity.svg' },
    { title: 'Život', accessor: () => 'Vyloučen', icon: '/img/Universe/Database/Life.svg' },
    { title: 'Metoda', accessor: () => null, render: () => <>Tranzit<br />Radiální rychlost</>, icon: '/img/Universe/Database/Discovery.svg' }
]

const Database: React.FC<Props> & Static = ({ ...props }) => {

    const data = new Array(20).fill({
        name: 'VY Canis Majoris',
        mass: 1.28,
        diameter: 2.36,
        temperature: '5536 K',
        luminosity: 128,
        absoluteMagnitude: 12,
        color: '#FFAA00',
        spectralClass: SpectralType.A,
        planets: [{
            diameter: 12475,
            mass: 1234,
            surfaceTemperature: '128 °C',
            orbitalPeriod: 1234,
            semiMajorAxis: 123456,
            orbitalVelocity: 72,
            density: 1154,
            type: 1
        }],
        type: StarType.YELLOW_DWARF,
        distance: 5
    })

    return (
        <Table
            items={data}
            levels={[
                { columns: starColumns, },
                { columns: planetColumns, accessor: star => star.planets }
            ]} />
    )

}

export default Database