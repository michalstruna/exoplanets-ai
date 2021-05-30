import React from 'react'
import Styled from 'styled-components'

import { Units, UnitType, useStrings, useSelector } from '../../Data'
import { HierarchicalTable, IconText, ToggleLine } from '../../Layout'
import { Url } from '../../Routing'
import { Color } from '../../Style'
import { RankedPlanetData } from '../types'
import { getPlanetRanks, Value } from '..'
import { Async } from '../../Async'
import { PlanetRanks } from '../../Stats'

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
    }
`

const icons = ['Database/Planet/Earth.png', 'Database/Planet/Jupiter.png']


type Rank = {
    name: keyof PlanetRanks
    formatValue?: (value: number) => React.ReactNode
    titleValue?: string
    format?: (value: number) => React.ReactNode
    getter: (planet: RankedPlanetData) => number
    title?: string
}

const PlanetsRank = ({ ...props }: Props) => {

    const strings = useStrings().planets
    const planetRanks = useSelector(state => state.database.planetRanks)


    const items = React.useMemo(() => {
        const ranks: Rank[] = [
            { name: 'latest', getter: p => Value.Planet.prop(p, 'diameter'), format: v => Units.format(v, UnitType.KM), title: strings.diameter, formatValue: v => '19. 7. 2017', titleValue: strings.discovery },
            { name: 'nearest', getter: p => Value.Planet.prop(p, 'diameter'), format: v => Units.format(v, UnitType.KM), title: strings.diameter, formatValue: v => Units.format(v, UnitType.LY), titleValue: strings.distance },
            { name: 'similar', getter: p => Value.Planet.prop(p, 'diameter'), format: v => Units.format(v, UnitType.LY), title: strings.distance, formatValue: v => Units.format(v, UnitType.KM), titleValue: strings.diameter }
        ]
        
        return planetRanks.payload && ranks.map((rank => {
            const planets = planetRanks.payload![rank.name] as any

            return {
                header: strings[rank.name], link: { pathname: Url.DATABASE }, content: (
                    <HierarchicalTable items={planets || []} columns={[
                        { accessor: (planet: RankedPlanetData, i: number) => (i + 1) + '.', title: '#', width: '2.5rem' },
                        { accessor: (planet: RankedPlanetData) => Value.Planet.props(planet, 'name'), title: strings.planet, render: name => <IconText text={name} icon={icons[Math.floor(Math.random() * 2)]} size='2.35rem' />, width: 10 },
                        { accessor: (planet: RankedPlanetData, i: number) => planet.value, render: rank.formatValue, title: rank.titleValue, width: '9rem' },
                        { accessor: rank.getter, render: rank.format, title: rank.title, width: '9rem' }
                    ]} />
                )
    }}))}, [planetRanks, strings])

    return (
        <Root {...props}>
            <Async
                data={[planetRanks, getPlanetRanks]}
                success={() => <ToggleLine items={items!} />} />
        </Root>
    )

}

export default PlanetsRank