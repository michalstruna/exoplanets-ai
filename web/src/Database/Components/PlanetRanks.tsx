import React from 'react'
import Styled from 'styled-components'
import { capitalCase } from 'change-case'

import { Units, UnitType, useStrings, useSelector } from '../../Data'
import { HierarchicalTable, IconText, ToggleLine } from '../../Layout'
import { Url } from '../../Routing'
import { Color } from '../../Style'
import { RankedPlanetData } from '../types'
import { getPlanetRanks, Value } from '..'
import { Async } from '../../Async'
import { PlanetRanks } from '../../Stats'
import { Dates } from '../../Native'

interface Props extends React.ComponentPropsWithoutRef<'div'> {}

const Root = Styled.div`
    background-color: ${Color.MEDIUM_DARK};
    box-sizing: border-box;
    padding: 1rem;
    position: relative;

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

type Rank = {
    name: keyof PlanetRanks
    formatValue?: (value: number) => React.ReactNode
    titleValue?: string
    format?: (value: number) => React.ReactNode
    getter: (planet: RankedPlanetData) => number
    valueGetter?: (planet: RankedPlanetData) => number
    title?: string
}

const PlanetsRank = ({ ...props }: Props) => {
    const strings = useStrings().planets
    const planetRanks = useSelector(state => state.database.planetRanks)

    const items = React.useMemo(() => {
        const ranks: Rank[] = [
            {
                name: 'latest',
                getter: p => p.distance,
                format: v => (!v ? '' : Units.format(v, UnitType.LY)),
                title: strings.distance,
                formatValue: v => (!v ? '' : Dates.formatDate(v)),
                titleValue: strings.discoveryDate
            },
            {
                name: 'nearest',
                getter: p => Value.Planet.prop(p, 'diameter'),
                format: v => (!v ? '' : Units.format(v, UnitType.EARTH_RAD)),
                title: strings.diameter,
                formatValue: v => (!v ? '' : Units.format(v, UnitType.LY)),
                titleValue: strings.distance
            },
            {
                name: 'similar',
                getter: p => Value.Planet.prop(p, 'diameter'),
                valueGetter: p => p.distance,
                format: v => (!v ? '' : Units.format(v, UnitType.EARTH_RAD)),
                title: strings.diameter,
                formatValue: v => (!v ? '' : Units.format(v, UnitType.LY)),
                titleValue: strings.distance
            }
        ]

        return (
            planetRanks.payload &&
            ranks.map(rank => {
                const planets = planetRanks.payload![rank.name] as any

                return {
                    header: strings[rank.name],
                    link: { pathname: Url.DATABASE },
                    content: (
                        <HierarchicalTable
                            items={planets || []}
                            columns={[
                                {
                                    accessor: (planet: RankedPlanetData, i: number) => i + 1 + '.',
                                    title: '#',
                                    width: '2.5rem'
                                },
                                {
                                    accessor: (planet: RankedPlanetData) => Value.Planet.props(planet, 'name'),
                                    title: strings.planet,
                                    render: (name, planet) => (
                                        <IconText
                                            text={name}
                                            icon={`Database/Planet/${capitalCase(
                                                planet.properties[0].type || 'unknown'
                                            )}.png`}
                                            size="2.35rem"
                                        />
                                    ),
                                    width: 10
                                },
                                {
                                    accessor: (planet: RankedPlanetData) => rank.valueGetter?.(planet) || planet.value,
                                    render: rank.formatValue,
                                    title: rank.titleValue,
                                    width: '9rem'
                                },
                                { accessor: rank.getter, render: rank.format, title: rank.title, width: '9rem' }
                            ]}
                        />
                    )
                }
            })
        )
    }, [planetRanks, strings])

    return (
        <Root {...props}>
            <Async data={[planetRanks, getPlanetRanks]} success={() => <ToggleLine items={items!} />} />
        </Root>
    )
}

export default PlanetsRank
