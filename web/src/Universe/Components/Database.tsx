import React from 'react'
import Styled from 'styled-components'
import { Dimensions, Mixin, Validator } from '../../Utils'
import SpectralType from '../Constants/SpectralType'
import { Planet } from '../types'
import HierarchicalTable from './HierarchicalTable'
import MiniGraph from './MiniGraph'
import { Query, Urls } from '../../Routing'

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


function xmur3(str) {
    for(var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353),
            h = h << 13 | h >>> 19;
    return function() {
        h = Math.imul(h ^ h >>> 16, 2246822507);
        h = Math.imul(h ^ h >>> 13, 3266489909);
        return (h ^= h >>> 16) >>> 0;
    }
}

function xoshiro128ss(a, b, c, d) {
    return function() {
        var t = b << 9, r = a * 5; r = (r << 7 | r >>> 25) * 9;
        c ^= a; d ^= b;
        b ^= c; a ^= d; c ^= t;
        d = d << 11 | d >>> 21;
        return (r >>> 0) / 4294967296;
    }
}

const seed = xmur3('a')
const rand = xoshiro128ss(seed(), seed(), seed(), seed())
const get = (val, i = 0) => Math.round(val * rand())

const data = []

for (let i = 0; i < 20; i++) {
    data.push({
        name: 'VY Canis Majoris',
        mass: get(128, i),
        diameter: get(236, i),
        temperature: get(5536, i) + ' K',
        luminosity: get(128, i),
        absoluteMagnitude: get(12, i),
        color: '#FFAA00',
        spectralClass: SpectralType.A,
        observation: {
            transit: [119.88, 100.21, 86.46, 48.68, 46.12, 39.39, 18.57, 6.98, 6.63, -21.97, -23.17, -29.26, -33.99, -6.25, -28.12, -27.24, -32.28, -12.29, -16.57, -23.86, -5.69, 9.24, 35.52, 81.2, 116.49, 133.99, 148.97, 174.15, 187.77, 215.3, 246.8, -56.68, -56.68, -56.68, -52.05, -31.52, -31.15, -48.53, -38.93, -26.06, 6.63, 29.13, 64.7, 79.74, 12.21, 12.21, -19.94, -28.6, -20.54, 51.39, 22.06, -25.19, -21.59, -12.83, -23.44, -29.86, -23.36, -7.58, -13.74, -12.15, 13.87, 31.66, 28.52, 52.38, 49.17, 90.2, 90.92, 101.25, 18.63, 18.63, 17.73, 0.07, 9.35, -16.77, -22.06, -34.04, -36.12, -20.3, -34.39, -38.15, -39.48, -46.41, -35.29, -37.61, -31.8, -17.83, -11.92, 19.95, 39.26, 42.52, 42.29, 93.7, 10.37, 10.37, 9.49, 8.15, 12.5, -17.51, -16.88],
            radialVelocity: [5736.59, 5699.98, 5717.16, 5692.73, 5663.83, 5631.16, 5626.39, 5569.47, 5550.44, 5458.8, 5329.39, 5191.38, 5031.39, 4769.89, 4419.66, 4218.92, 3924.73, 3605.3, 3326.55, 3021.2, 2800.61, 2474.48, 2258.33, 1951.69, 1749.86, 1585.38, 1575.48, 1568.41, 1661.08, 1977.33, 2425.62, 2889.61, 3847.64, 3847.64, 3741.2, 3453.47, 3202.61, 2923.73, 2694.84, 2474.22, 2195.09, 1962.83, 1705.44, 1468.27, 3730.77, 3730.77, 3833.3, 3822.06, 3803.47, 3813.12, 3726.64, 3628.41, 3551.48, 3487.67, 3281.59, 3162.28, 3020.41, 2870.92, 2677.28, 2516.52, 2240.17, 1979.09, 1819.89, 1634.17, 1456.56, 1320.67, 1223.48, 1229.55, 3364.64, 3364.64, 3511.94, 3656.59, 3746.75, 3861.31, 3805.31, 3787.61, 3759.25, 3694.7, 3610.81, 3560.61, 3398.39, 3313.47, 3105.66, 2930.78, 2688.05, 2481.83, 2205.97, 1902.69, 1715.66, 1558.75, 1484.14, 1317.77, 3320.39, 3320.39, 3395.19, 3465.33, 3592.84, 3687.42, 3861.28]
        },
        planets: new Array(get(5)).fill(null).map(() =>({
            diameter: get(12475, i),
            mass: get(1234, i),
            surfaceTemperature: '128 °C',
            orbitalPeriod: get(1234, i),
            semiMajorAxis: get(123456, i),
            orbitalVelocity: get(72, i),
            density: get(1154, i),
            type: 1
        })),
        type: i % 5,
        distance: get(5, i)
    })
}

for (const i in data) {
    const star = data[i]
    const j = parseInt(i)

    if (j % 4 === 0) {
        star.tmp = star.observation.transit.map((v, i) => ({
            transit: star.observation.transit[i]
        }))
    } else if (j % 4 === 1) {
        star.tmp = star.observation.transit.map((v, i) => ({
            radialVelocity: Math.round(star.observation.radialVelocity[i]) / 100
        }))
    } else if (j % 4 === 2) {
        star.tmp = star.observation.transit.map((v, i) => ({
            transit: star.observation.transit[i],
            radialVelocity: Math.round(star.observation.radialVelocity[i]) / 100
        }))
    } else {

    }
}

const lines = ['transit', 'radialVelocity']
const labels = ['Tranzit [%]', 'Radiální rychlost [m/s]']

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
        render: v => v + ' km'
    },
    { title: 'Hmotnost', accessor: star => star.mass, icon: '/img/Universe/Database/Mass.svg' },
    { title: 'Teplota', accessor: star => star.temperature, icon: '/img/Universe/Database/Temperature.svg' },
    { title: 'Zářivý výkon', accessor: star => star.luminosity, icon: '/img/Universe/Database/Luminosity.svg' },
    { title: 'Vzdálenost', accessor: star => star.distance, icon: '/img/Universe/Database/Distance.svg' },
    { title: 'Planet', accessor: star => star.planets.length, icon: '/img/Universe/Database/Planet.svg' },
    { title: '', accessor: star => star.planets.length, icon: '', render: value => '' },
    {
        title: <><Colored color='#77CC77'>Tranzit [%]</Colored>&nbsp;/&nbsp; <Colored color='#CC7777'>radiální
            rychlost [m/s]</Colored></>,
        accessor: () => null,
        render: (value, star) => <MiniGraph data={star.tmp} lines={lines} labels={labels} height={80} width={320} />,
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

    const handleSort = (column: number, isAsc: boolean, level: number) => {
        Urls.replace({
            query: {
                [Query.ORDER_COLUMN]: column,
                [Query.ORDER_IS_ASC]: +isAsc,
                [Query.ORDER_LEVEL]: level
            }
        })
    }

    return (
        <Table
            items={data}
            levels={levels}
            onSort={handleSort}
            defaultSort={defaultSort} />
    )

}

export default Database