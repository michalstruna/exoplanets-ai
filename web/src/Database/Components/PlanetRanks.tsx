import React from 'react'
import Styled from 'styled-components'

import { Units, UnitType, useStrings } from '../../Data'
import { HierarchicalTable, IconText, ToggleLine } from '../../Layout'
import { Url } from '../../Routing'
import { Color } from '../../Style'
import { PlanetData } from '../types'
import { useDatabaseState, getPlanetRanks } from '..'
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
const ranks: (keyof PlanetRanks)[] = ['latest', 'nearest', 'similar']

const PlanetsRank = ({ ...props }: Props) => {

    const strings = useStrings().planets
    const { planetRanks } = useDatabaseState()


    const items = React.useMemo(() => planetRanks.payload && ranks.map(((rank) => {
        const planets = planetRanks.payload![rank] as any

        return {
            header: strings[rank], link: { pathname: Url.DATABASE }, content: (
                <HierarchicalTable items={planets || []} columns={[
                    { accessor: (planet: PlanetData, i: number) => i + 1, title: '#', render: i => i + '.', width: '2.5rem' },
                    { accessor: (planet: PlanetData, i: number) => planets[i].name, title: strings.planet, render: name => <IconText text={name} icon={icons[Math.floor(Math.random() * 2)]} size='2.35rem' />, width: 10 },
                    { accessor: (planet: PlanetData, i: number) => planets[i].diameter, render: v => Units.format(v, UnitType.KM), title: strings.diameter, width: '9rem' },
                    { accessor: (planet: PlanetData, i: number) => planets[i].distance, render: v => Units.format(v, UnitType.LY), title: strings.distance, width: '9rem' }
                ]} />
            )
    }})), [planetRanks, strings])

    return (
        <Root {...props}>
            <Async
                data={[planetRanks, getPlanetRanks]}
                success={() => <ToggleLine items={items!} />} />
        </Root>
    )

}

export default PlanetsRank