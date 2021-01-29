import React from 'react'
import Styled from 'styled-components'
import { Units, UnitType, useStrings } from '../../Data'
import { HierarchicalTable, IconText, ToggleLine } from '../../Layout'
import { Url } from '../../Routing'
import { Color } from '../../Style'
import { PlanetData } from '../types'

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

const Root = Styled.div`
    background-color: ${Color.MEDIUM_DARK};
    box-sizing: border-box;
    padding: 1rem;

    ${HierarchicalTable.Header} {
        background-color: ${Color.MEDIUM_DARK};
        font-weight: bold;
    }

    ${HierarchicalTable.Row} { 
        box-sizing: border-box;
        padding-right: 8rem;

        &:nth-of-type(2n + 1) {
            background-color: ${Color.MEDIUM_DARK};
        }
    }

    ${HierarchicalTable.Cell} {
        background-color: transparent !important;

        &:after {
            display: none;
        }
    }
`

const planets = [
    { name: 'Proxima Centauri b', distance: 4.2, diameter: 15535 },
    { name: 'VY Canis Majors', distance: 5.2, diameter: 8963 },
    { name: 'Proxima Centauri b', distance: 4.2, diameter: 12411 },
    { name: 'VY Canis Majors', distance: 5.2, diameter: 13691 },
    { name: 'Proxima Centauri b', distance: 4.2, diameter: 15741 },
    { name: 'VY Canis Majors', distance: 5.2, diameter: 13691 },
]

const icons = ['Database/Planet/Earth.png', 'Database/Planet/Jupiter.png']

const PlanetsRank = ({ ...props }: Props) => {

    const strings = useStrings().planets

    const earthLike = (
        <HierarchicalTable items={planets} rowHeight={() => 52.5} columns={[
            { accessor: (planet: PlanetData, i: number) => i + 1, title: '#', render: i => i + '.', width: '2.5rem' },
            { accessor: (planet: PlanetData, i: number) => 'Abcbcd', title: strings.planet, render: name => <IconText text={name} icon={icons[Math.floor(Math.random() * 2)]} size='2.35rem' />, width: 10 },
            { accessor: (planet: PlanetData) => 32333, render: v => Units.format(v, UnitType.KM), title: strings.diameter, width: '9rem' },
            { accessor: (planet: PlanetData) => 12.34, render: v => Units.format(v, UnitType.LY), title: strings.distance, width: '9rem' }
        ]} />
    )

    return (
        <Root {...props}>
            <ToggleLine items={[
                { header: strings.last, content: earthLike, link: { pathname: Url.DATABASE } },
                { header: strings.mostSimilar, content: earthLike, link: { pathname: Url.DATABASE } },
                { header: strings.nearest, content: earthLike, link: { pathname: Url.DATABASE } }
            ]} />
        </Root>
    )

}

export default PlanetsRank