import React from 'react'
import Styled from 'styled-components'
import { pascalCase } from 'pascal-case'
import useRouter from 'use-react-router'

import { FlexLine, ListSection, MinorSectionTitle, PageTitle, PlainTable, SectionTitle, Tags } from '../../Layout'
import SizeVisualization from '../Components/SizeVisualization'
import DistanceVisualization from '../Components/DistanceVisualization'
import { Async } from '../../Async'
import { getSystem, Value } from '..'
import { LightCurveData, PlanetData } from '../types'
import { useStrings, useSelector } from '../../Data'
import { Curve } from '../../Stats'
import { Planet as PlanetPreview, Star as StarPreview } from '../Components/ItemPreview'
import SkyMap from '../Components/System/SkyMap'
import References from '../Components/References'
import LightCurve from '../Components/System/LightCurve'
import SystemContent from '../Components/System/SystemContent'
import StarTable from '../Components/System/StarTable' 
import PlanetTable from '../Components/System/PlanetTable'

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

const Root = Styled.div`
    display: flex;
    width: 100%;
`

const Main = Styled.main`
    box-sizing: border-box;
    flex: 1 1 calc(100vw - 15rem);
    overflow: hidden;
    padding: 1rem;
    padding-left: 2rem;
    padding-top: 1.5rem;
`

const MainLeft = Styled.div`
    width: calc(100% - 24rem);
`

const Title = Styled(PageTitle)`
`

const Subtitle = Styled(SectionTitle)`

`

const Subsubtitle = Styled(MinorSectionTitle)`
    ${Subtitle} + & {
        padding-top: 0;
    }
`

const Actions = Styled(PlainTable)`
    overflow-y: scroll;
    margin: 0;
    max-height: 20rem;
    max-width: 60rem;
    
    th, td {
        padding: 0.25rem 0.5rem;
    }

    td {
        background-color: transparent !important;
        text-align: left !important;
    }
    
    tr:nth-of-type(2n) {
        background-color: rgba(0, 0, 0, 0.1);
    }
`

const SystemView = ({ ...props }: Props) => {

    const systemName = useRouter<any>().match.params.system
    const system = useSelector(state => state.database.system)
    const str = useStrings()
    const strings = str.system

    const refMap = React.useMemo(() => {
        if (!system.payload) {
            return {}
        }

        const result: Record<string, number> = {}

        for (const i in system.payload.datasets) {
            const dataset = system.payload.datasets[i]
            result[dataset.name] = parseInt(i) + 1
        }

        return result
    }, [system])

    return (
        <Async
            data={[system, () => getSystem(systemName), [systemName]]}
            success={() => (
                <Root {...props}>
                    <SystemContent system={system.payload!} />
                    <Main>
                        <FlexLine>
                            <StarPreview item={system.payload!} titleComponent={Title} />
                            <Tags items={Value.Star.names(system.payload!, name => ({ text: name }))} />
                        </FlexLine>
                        <FlexLine style={{ paddingTop: 0 }}>
                            <MainLeft>
                                <FlexLine>
                                    <SkyMap target={Value.Star.name(system.payload!)!} />
                                </FlexLine>
                                <Subtitle>
                                    {strings.observations}
                                </Subtitle>
                                <Subsubtitle>
                                    {strings.lightCurve} ({system.payload!.light_curves.length})
                                </Subsubtitle>
                                <ListSection items={system.payload!.light_curves.map((lc: LightCurveData, i: number) => (
                                    <LightCurve data={lc} key={i} refMap={refMap} reverse={i % 2 === 1} />
                                ))} />
                                <Subtitle>
                                    {strings.planets} ({system.payload!.planets.length})
                                </Subtitle>
                                <ListSection items={system.payload!.planets.map((planet: PlanetData, i: number) => (
                                    <React.Fragment key={i}>
                                        <FlexLine>
                                            <PlanetPreview item={planet} titleComponent={Subsubtitle} />
                                            <Tags items={Value.Star.names(system.payload!, name => ({ text: name }))} />
                                        </FlexLine>
                                        <PlanetTable data={planet} />
                                        {Value.Planet.props(planet, 'transit', {
                                            refMap, render: (val, ref) => (
                                                <FlexLine>
                                                    <Curve data={val?.local_view as any} type={Curve.LV} width={390} height={200} title={<>{strings.localView} {ref}</>} />
                                                    <Curve data={val?.global_view as any} type={Curve.GV} width={390} height={200} title={<>{strings.globalView} {ref}</>} />
                                                </FlexLine>
                                            )
                                        })}
                                    </React.Fragment>
                                ))} />
                            </MainLeft>
                            <StarTable data={system.payload!} refMap={refMap} />
                        </FlexLine>
                        <Subtitle>
                            Vizualizace
                        </Subtitle>
                        <Subsubtitle>
                            Velikosti
                        </Subsubtitle>
                        <SizeVisualization systems={[
                            [
                                {
                                    name: 'Slunce',
                                    size: 1392684,
                                    image: 'https://www.clker.com/cliparts/W/i/K/w/1/D/glossy-orange-circle-icon-md.png' // TODO
                                },
                                { name: 'Merkur', size: 4879, image: '/img/System/Size/Mercury.png' },
                                { name: 'Venuše', size: 12104, image: '/img/System/Size/Venus.png' },
                                { name: 'Země', size: 12756, image: '/img/System/Size/Earth.png' },
                                { name: 'Mars', size: 6902, image: '/img/System/Size/Mars.png' },
                                { name: 'Jupiter', size: 142988, image: '/img/System/Size/Jupiter.png' },
                                { name: 'Saturn', size: 127061, image: '/img/System/Size/Saturn.png' },
                                { name: 'Uran', size: 51000, image: '/img/System/Size/Uranus.png' },
                                { name: 'Neptun', size: 49000, image: '/img/System/Size/Neptune.png' },
                                { name: 'Pluto', size: 2376, image: '/img/System/Size/Pluto.png' }
                            ],
                            [
                                {
                                    name: 'Kepler-10',
                                    size: 268147,
                                    image: 'https://www.clker.com/cliparts/W/i/K/w/1/D/glossy-orange-circle-icon-md.png'
                                },
                                ...system.payload!.planets.map((planet: PlanetData) => ({
                                    name: planet.properties[0].name,
                                    size: (planet.properties[0]?.diameter || 0) * 12756,
                                    image: `/img/Database/Planet/${pascalCase(planet.properties[0].type || 'unknown')}.png`
                                }))
                            ]
                        ]} />
                        <Subsubtitle>
                            Vzdálenosti
                        </Subsubtitle>
                        <DistanceVisualization systems={[
                            [
                                { name: 'Slunce', distance: 0, size: 0.0093 },
                                { name: 'Merkur', distance: 0.387 },
                                { name: 'Venuše', distance: 0.668 },
                                { name: 'Země', distance: 1 },
                                { name: 'Mars', distance: 1.52 },
                                { name: 'Jupiter', distance: 5.2 },
                                { name: 'Saturn', distance: 9.58 },
                                { name: 'Uran', distance: 19.198 },
                                { name: 'Neptun', distance: 30.067 }
                            ],
                            [
                                { name: 'Kepler-10', distance: 0, size: 0.005 },
                                ...system.payload!.planets.map((planet: PlanetData) => ({
                                    name: planet.properties[0].name,
                                    distance: planet.properties[0].semi_major_axis!
                                }))
                            ]
                        ]} lifeZones={[
                            { from: 0.6, to: 1.67 },
                            {
                                from: system.payload!.properties[0] ? system.payload!.properties[0].life_zone?.min_radius || 0 : 0,
                                to: system.payload!.properties[0] ? system.payload!.properties[0].life_zone?.max_radius || 0 : 0
                            }
                        ]} /> 
                        <Subsubtitle>
                            Interaktivní model
                        </Subsubtitle>
                        <Subtitle>
                            Reference
                        </Subtitle>
                        <References items={system.payload!.datasets} />
                        <Subtitle>
                            Aktivity
                        </Subtitle>
                        <Actions>
                            <tbody>
                            <tr>
                                <th>Datum</th>
                                <th>Uživatel</th>
                                <th>Akce</th>
                                <th colSpan={2}>Zdroj</th>
                            </tr>
                            <tr>
                                <td>12. 9. 2020 9.38:25</td>
                                <td>Michal</td>
                                <td>Přidány planety (1)</td>
                                <td colSpan={2}>Dataset Kepler mission</td>
                            </tr>
                            {new Array(100).fill(0).map((v, i) => (
                                <tr key={i}>
                                    <td>12. 9. 2020 9.38:25</td>
                                    <td>Michal</td>
                                    <td>Editace</td>
                                    <td colSpan={2}><i>Manuální</i></td>
                                </tr>
                            ))}
                            </tbody>
                        </Actions>
                    </Main>
                </Root>
            )}
        />
    )

}

export default SystemView

// 582, 256