import React from 'react'
import Styled from 'styled-components'

import DetailContent from '../Components/DetailContent'
import { Fraction, ListSection, MinorSectionTitle, PageTitle, SectionTitle, Tags } from '../../Layout'
import SizeVisualization from '../Components/SizeVisualization'
import DistanceVisualization from '../Components/DistanceVisualization'
import { Async } from '../../Async'
import { useSystem, getSystem, Value } from '..'
import useRouter from 'use-react-router'
import { LightCurve, PlanetData } from '../types'
import { useStrings } from '../../Data'
import { Curve } from '../../Stats'
import ItemPreview from '../Components/ItemPreview'
import SkyMap from '../Components/SkyMap'
import References from '../Components/References'
import { Numbers } from '../../Native'
import Ref from '../Components/Ref'

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

const Table = Styled.table`
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-collapse: collapse;
    margin: 1rem 0;
    table-layout: fixed;
    width: 22rem;
    
    tr {
        &:nth-of-type(2n + 1) td:nth-of-type(2n + 1) {
            background-color: rgba(0, 0, 0, 0.1);
        }
        
        &:nth-of-type(2n) td:nth-of-type(2n) {
            background-color: rgba(0, 0, 0, 0.1);
        }
    }

    td, th {
        padding: 0.75rem 1rem;
        width: 50%;
    
        &:nth-of-type(2n + 1) {
            text-align: right;
        }
    }
    
    th {
        background-color: rgba(0, 0, 0, 0.15);
        text-align: center !important;
    }
`

const HTable = Styled(Table)`
    width: 100%;
`

const Actions = Styled(HTable)`
    td {
        background-color: transparent !important;
        text-align: left !important;
    }
    
    tr:nth-of-type(2n) {
        background-color: rgba(0, 0, 0, 0.1);
    }
`

const History = Styled.div`
    overflow-y: scroll;
    max-height: 20rem;
    max-width: 60rem;
    
    th, td {
        padding: 0.25rem 0.5rem;
    }
    
    table {
        margin: 0;   
    }
`

interface HorizontalProps {
    reverse?: boolean
}

const Horizontal = Styled.div<HorizontalProps>`
    display: flex;
    justify-content: flex-start;
    overflow: hidden;
    padding: 1rem 0;
    
    & > * {
        margin-right: 2rem;
        
        &:last-child {
            margin-right: 0;
        }
    }
    
    ${props => props.reverse && `
        flex-direction: row-reverse;   
        justify-content: flex-end;
        
        & > * {
            margin-right: 0rem;
            margin-left: 2rem;
            
            &:last-child {
                margin-left: 0;
            }
        }
    `}
`

const CenteredHorizontal = Styled(Horizontal)<HorizontalProps>`
    align-items: center;
    margin-top: 1rem;
    padding: 0;
`

const ListLc = Styled(ListSection)`
    & > * {
        margin-bottom: 2rem;
    }
`

const SystemView = ({ ...props }: Props) => {

    const systemName = useRouter<any>().match.params.system
    const system = useSystem()
    const str = useStrings()
    const strings = str.system
    const properties = str.properties
    const planets = str.planets

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
                    <DetailContent title={strings.content} sections={[
                        { name: 'top', text: (Value.Star.name(system.payload) || '') },
                        {
                            name: '', text: strings.observations, children: [
                                { name: '', text: strings.lightCurve + ' (0)' },
                                { name: '', text: strings.radialVelocity + ' (0)' }
                            ]
                        },
                        {
                            name: '',
                            text: strings.planets + ' (' + system.payload.planets.length + ')',
                            children: system.payload.planets.map((planet: PlanetData) => ({
                                name: planet.properties[0].name,
                                text: planet.properties[0].name
                            }))
                        },
                        {
                            name: '', text: strings.visualization, children: [
                                { name: '', text: strings.sizes },
                                { name: '', text: strings.distances },
                                { name: '', text: strings.model }
                            ]
                        },
                        { name: '', text: strings.references },
                        { name: '', text: strings.activities }
                    ]} />
                    <Main>
                        <CenteredHorizontal>
                            <ItemPreview.Star item={system.payload} titleComponent={Title} />
                            <Tags items={Value.Star.names(system.payload, name => ({ text: name }))} />
                        </CenteredHorizontal>

                        <Horizontal style={{ paddingTop: 0 }}>
                            <MainLeft>
                                <Horizontal>
                                    <SkyMap />
                                </Horizontal>
                                <Subtitle>
                                    {strings.observations}
                                </Subtitle>
                                <Subsubtitle>
                                    {strings.lightCurve} ({system.payload.light_curves.length})
                                </Subsubtitle>
                                <ListLc items={system.payload.light_curves.map((lc: LightCurve, i: number) => (
                                    <CenteredHorizontal key={i} reverse={i % 2 > 0}>
                                        <Curve data={lc} width={390} height={200} type={Curve.LC} />
                                        <Table>
                                            <tbody>
                                            <tr>
                                                <th colSpan={2}>{lc.dataset} <Ref refMap={refMap} refs={lc.dataset} />
                                                </th>
                                            </tr>
                                            <tr>
                                                <td>Počet pozorování</td>
                                                <td>{Numbers.format(lc.n_observations)}</td>
                                            </tr>
                                            <tr>
                                                <td>Délka</td>
                                                <td>{Numbers.format(lc.n_days)} d</td>
                                            </tr>
                                            </tbody>
                                        </Table>
                                    </CenteredHorizontal>
                                ))} />
                                <Subsubtitle>
                                    Radiální rychlost (0)
                                </Subsubtitle>
                                <ListSection items={system.payload.light_curves.map((lc: LightCurve, i: number) => (
                                    <div key={i}>
                                        RV
                                    </div>
                                ))} />
                                <Subtitle>
                                    {strings.planets} ({system.payload.planets.length})
                                </Subtitle>
                                <ListSection items={system.payload.light_curves.map((lc: LightCurve, i: number) => (
                                    system.payload.planets.map((planet: PlanetData, j: number) => (
                                        <React.Fragment key={j}>
                                            <CenteredHorizontal>
                                                <ItemPreview.Planet item={planet} titleComponent={Subsubtitle} />
                                                <Tags
                                                    items={Value.Star.names(system.payload, name => ({ text: name }))} />
                                            </CenteredHorizontal>
                                            <HTable>
                                                <tbody>
                                                <tr>
                                                    <th colSpan={2}>{strings.matter}</th>
                                                    <th colSpan={2}>{strings.orbit}</th>
                                                    <th colSpan={2}>{strings.other}</th>
                                                </tr>
                                                <tr>
                                                    <td>{properties.diameter}</td>
                                                    <td>{Value.Planet.props(planet, 'diameter', {
                                                        refMap,
                                                        unit: <>d<sub>⊕</sub></>
                                                    })}</td>
                                                    <td>{properties.orbitalPeriod}</td>
                                                    <td>{Value.Planet.props(planet, 'orbital_period', {
                                                        refMap,
                                                        unit: 'd'
                                                    })}</td>
                                                    <td>{properties.lifeConditions}</td>
                                                    <td>{Value.Planet.props(planet, 'life_conditions', { refMap })}</td>
                                                </tr>
                                                <tr>
                                                    <td>{properties.mass}</td>
                                                    <td>{Value.Planet.props(planet, 'mass', {
                                                        refMap,
                                                        unit: <>M<sub>⊕</sub></>
                                                    })}</td>
                                                    <td>{properties.semiMajorAxis}</td>
                                                    <td>{Value.Planet.props(planet, 'semi_major_axis', {
                                                        refMap,
                                                        unit: <>M<sub>⊕</sub></>
                                                    })}</td>
                                                    <td>{properties.surfaceTemperature}</td>
                                                    <td>{Value.Planet.props(planet, 'surface_temperature', {
                                                        refMap,
                                                        unit: 'K'
                                                    })}</td>
                                                </tr>
                                                <tr>
                                                    <td>{properties.density}</td>
                                                    <td>{Value.Planet.props(planet, 'density', {
                                                        refMap,
                                                        unit: 'd'
                                                    })}</td>
                                                    <td>{properties.orbitalVelocity}</td>
                                                    <td>{Value.Planet.props(planet, 'orbital_velocity', {
                                                        refMap,
                                                        unit: 'd'
                                                    })}</td>
                                                    <td>{properties.status}</td>
                                                    <td>{planets.statuses[planet.status]}</td>
                                                </tr>
                                                <tr>
                                                    <td>{properties.surfaceGravity}</td>
                                                    <td>{Value.Planet.props(planet, 'surface_gravity', { refMap })}</td>
                                                    <td>{properties.eccentricity}</td>
                                                    <td>{Value.Planet.props(planet, 'eccentricity', { refMap })}</td>
                                                    <td>???</td>
                                                    <td>???</td>
                                                </tr>
                                                </tbody>
                                            </HTable>
                                                {Value.Planet.props(planet, 'transit', {
                                                    refMap, format: (val, ref) => (
                                                        <Horizontal>
                                                            <Curve
                                                                data={val?.local_view as any}
                                                                type={Curve.LV} width={390} height={200}
                                                                title={<>{strings.localView} {ref}</>} />
                                                            <Curve
                                                                data={val?.global_view as any}
                                                                type={Curve.GV} width={390} height={200}
                                                                title={<>{strings.globalView} {ref}</>} />
                                                        </Horizontal>
                                                    )
                                                })}
                                        </React.Fragment>
                                    ))
                                ))} />
                            </MainLeft>

                            <Table>
                                <tbody>
                                <tr>
                                    <th colSpan={2}>Poloha</th>
                                </tr>
                                <tr>
                                    <td>Vzdálenost</td>
                                    <td>
                                        {Value.Star.props(system.payload, 'distance', { refMap, unit: 'pc' })}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Rektascenze</td>
                                    <td>
                                        {Value.Star.props(system.payload, 'ra', {
                                            refMap,
                                            format: Numbers.formatHours
                                        })}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Deklinace</td>
                                    <td>
                                        {Value.Star.props(system.payload, 'dec', { refMap, format: Numbers.formatDeg })}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Souhvězdí</td>
                                    <td>
                                        {Value.Star.props(system.payload, 'constellation', { refMap })}
                                    </td>
                                </tr>
                                <tr>
                                    <th colSpan={2}>Povrch</th>
                                </tr>
                                <tr>
                                    <td>Teplota</td>
                                    <td>
                                        {Value.Star.props(system.payload, 'surface_temperature', { refMap, unit: 'K' })}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Zdánl. mag.</td>
                                    <td>
                                        {Value.Star.props(system.payload, 'apparent_magnitude', {
                                            refMap,
                                            format: Numbers.format
                                        })}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Abs. mag.</td>
                                    <td>
                                        {Value.Star.props(system.payload, 'absolute_magnitude', {
                                            refMap,
                                            format: Numbers.format
                                        })}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Zářivý výkon</td>
                                    <td>
                                        {Value.Star.props(system.payload, 'luminosity', {
                                            refMap,
                                            unit: <>L<sub>☉</sub></>
                                        })}
                                    </td>
                                </tr>
                                <tr>
                                    <th colSpan={2}>Hmota</th>
                                </tr>
                                <tr>
                                    <td>Průměr</td>
                                    <td>
                                        {Value.Star.props(system.payload, 'diameter', {
                                            refMap,
                                            unit: <>d<sub>☉</sub></>
                                        })}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Hmotnost</td>
                                    <td>
                                        {Value.Star.props(system.payload, 'mass', { refMap, unit: <>M<sub>☉</sub></> })}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Hustota</td>
                                    <td>
                                        {Value.Star.props(system.payload, 'density', {
                                            refMap,
                                            unit: <Fraction top='kg' bottom={<>m<sup>3</sup></>} />
                                        })}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Gravitace</td>
                                    <td>
                                        {Value.Star.props(system.payload, 'surface_gravity', {
                                            refMap,
                                            unit: <Fraction top='m' bottom={<>s<sup>2</sup></>} />
                                        })}
                                    </td>
                                </tr>
                                <tr>
                                    <th colSpan={2}>Ostatní</th>
                                </tr>
                                <tr>
                                    <td>Metalicita</td>
                                    <td>
                                        {Value.Star.props(system.payload, 'metallicity', { refMap })}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Stáří</td>
                                    <td>
                                        {Value.Star.props(system.payload, 'age', { refMap, unit: 'mld. years' })}
                                    </td>
                                </tr>
                                </tbody>
                            </Table>

                        </Horizontal>
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
                                    image: 'https://www.clker.com/cliparts/W/i/K/w/1/D/glossy-orange-circle-icon-md.png'
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
                                    size: 162147,
                                    image: 'https://www.clker.com/cliparts/W/i/K/w/1/D/glossy-orange-circle-icon-md.png'
                                },
                                ...system.payload.planets.map((planet: PlanetData) => ({
                                    name: planet.properties[0].name,
                                    size: Math.random() * 10e4,
                                    image: '/img/System/Size/Mercury.png'
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
                                { name: 'K1', distance: 0.01 },
                                { name: 'K2', distance: 0.7 }
                                /*...system.payload.planets.map((planet: PlanetData) => ({
                                    name: planet.properties[0].name,
                                    distance: Math.random() * 10e7
                                }))*/
                            ]
                        ]} lifeZones={[
                            { from: 0.6, to: 1.67 },
                            {
                                from: system.payload.properties[0] ? system.payload.properties[0].life_zone.min_radius : 0,
                                to: system.payload.properties[0] ? system.payload.properties[0].life_zone.max_radius : 0
                            }
                        ]} />
                        <Subsubtitle>
                            Interaktivní model
                        </Subsubtitle>
                        <Subtitle>
                            Reference
                        </Subtitle>
                        <References items={system.payload.datasets} />
                        <Subtitle>
                            Aktivity
                        </Subtitle>
                        <History>
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
                        </History>
                    </Main>
                </Root>
            )}
        />
    )

}

export default SystemView