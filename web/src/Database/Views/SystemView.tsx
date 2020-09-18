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

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

const Root = Styled.div`
    display: flex;
`

const Main = Styled.main`
    box-sizing: border-box;
    flex: 1 1 0;
    padding: 1rem;
    padding-left: 2rem;
    padding-top: 1.5rem;
    width: calc(100% - 15rem);
`

const MainLeft = Styled.div`
    width: 60rem;
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
    width: 20rem;
    
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

const HTable = Styled.table`
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-collapse: collapse;
    margin: 1rem 0;
    table-layout: fixed;
    width: 100%;
    
    td, th {
        box-sizing: border-box;
        padding: 0.75rem 1rem;
        width: calc(100% / 6);
    }
    
    th {
        background-color: rgba(0, 0, 0, 0.2);
    }
    
    tr {
        &:nth-of-type(2n) {
            background-color: rgba(0, 0, 0, 0.1);
        
            td:nth-of-type(2n + 1) {
                background-color: rgba(0, 0, 0, 0.1);
            }
        }
        
        &:nth-of-type(2n + 1) {
            td:nth-of-type(2n + 1) {
                background-color: rgba(0, 0, 0, 0.1);
            }
        }
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

const Horizontal = Styled.div`
    display: flex;
    overflow: hidden;
    padding: 1rem 0;
    
    & > * {
        margin-right: 2rem;
        
        &:last-child {
            margin-right: 0;
        }
    }
`

const CenteredHorizontal = Styled(Horizontal)`
    align-items: center;
    margin-top: 1rem;
    padding: 0;
`

const refMap = { 'Kepler': 1, 'Kepler 2': 2, 'Kepler 3': 3 }

const SystemView = ({ ...props }: Props) => {

    const systemName = useRouter<any>().match.params.system
    const system = useSystem()
    const strings = useStrings().system

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
                                    Pozorování
                                </Subtitle>
                                <Subsubtitle>
                                    Světelná křivka (0)
                                </Subsubtitle>
                                <ListSection items={system.payload.light_curves.map((lc: LightCurve, i: number) => (
                                    <div key={i}>
                                        LC
                                    </div>
                                ))}  />
                                <Subsubtitle>
                                    Radiální rychlost (0)
                                </Subsubtitle>
                                <ListSection items={system.payload.light_curves.map((lc: LightCurve, i: number) => (
                                    <div key={i}>
                                        RV
                                    </div>
                                ))}  />
                                <Subtitle>
                                    {strings.planets} ({system.payload.planets.length})
                                </Subtitle>
                                <ListSection items={system.payload.light_curves.map((lc: LightCurve, i: number) => (
                                    system.payload.planets.map((planet: PlanetData, i: number) => (
                                            <>
                                                <CenteredHorizontal>
                                                    <ItemPreview.Planet item={planet} titleComponent={Subsubtitle} />
                                                    <Tags items={Value.Star.names(system.payload, name => ({ text: name }))} />
                                                </CenteredHorizontal>
                                                <HTable>
                                                    <tbody>
                                                    <tr>
                                                        <th colSpan={2}>Hmota</th>
                                                        <th colSpan={2}>Dráha</th>
                                                        <th colSpan={2}>Ostatní</th>
                                                    </tr>
                                                    <tr>
                                                        <td>Průměr</td>
                                                        <td>12 756</td>
                                                        <td>Perioda oběhu</td>
                                                        <td>12 756</td>
                                                        <td>Život</td>
                                                        <td>12 756</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Hmotnost</td>
                                                        <td>12 756</td>
                                                        <td>Velká poloosa</td>
                                                        <td>12 756</td>
                                                        <td>Teplota</td>
                                                        <td>12 756</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Hustota</td>
                                                        <td>12 756</td>
                                                        <td>Rychlost oběhu</td>
                                                        <td>12 756</td>
                                                        <td>Status</td>
                                                        <td>12 756</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Gravitace</td>
                                                        <td>12 756</td>
                                                        <td>Excentricita</td>
                                                        <td>12 756</td>
                                                        <td>Hmotnost</td>
                                                        <td>12 756</td>
                                                    </tr>
                                                    </tbody>
                                                </HTable>
                                                <Horizontal>
                                                    <Curve data={planet.properties[0].transit!.flux} color='#AFA'
                                                               width={390} height={200} />
                                                    <Curve data={planet.properties[0].transit!.flux} color='#AFA'
                                                               width={390} height={200} />
                                                </Horizontal>
                                            </>
                                        ))
                                ))}  />
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
                                    <td>Deklinace</td>
                                    <td>
                                        {Value.Star.props(system.payload, 'dec', { refMap, unit: '°' })}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Rektascenze</td>
                                    <td>
                                        {Value.Star.props(system.payload, 'ra', { refMap, unit: '°' })}
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
                                        {Value.Star.props(system.payload, 'apparent_magnitude', { refMap, format: Numbers.format })}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Abs. mag.</td>
                                    <td>
                                        {Value.Star.props(system.payload, 'absolute_magnitude', { refMap, format: Numbers.format })}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Zářivý výkon</td>
                                    <td>
                                        {Value.Star.props(system.payload, 'luminosity', { refMap, unit: <>L<sub>☉</sub></> })}
                                    </td>
                                </tr>
                                <tr>
                                    <th colSpan={2}>Hmota</th>
                                </tr>
                                <tr>
                                    <td>Průměr</td>
                                    <td>
                                        {Value.Star.props(system.payload, 'diameter', { refMap, unit: <>d<sub>☉</sub></> })}
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
                                        {Value.Star.props(system.payload, 'density', { refMap, unit: <Fraction top='kg' bottom={<>m<sup>3</sup></>}/> })}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Gravitace</td>
                                    <td>
                                        {Value.Star.props(system.payload, 'surface_gravity', { refMap, unit: <Fraction top='m' bottom={<>s<sup>2</sup></>}/> })}
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
                                { name: 'Slunce', distance: 0, size: 1392684 },
                                { name: 'Merkur', distance: 58e6 },
                                { name: 'Venuše', distance: 100e6 },
                                { name: 'Země', distance: 150e6 },
                                { name: 'Mars', distance: 228e6 },
                                { name: 'Jupiter', distance: 778e6 },
                                { name: 'Saturn', distance: 1433e6 },
                                { name: 'Uran', distance: 2872e6 },
                                { name: 'Neptun', distance: 4498e6 }
                            ],
                            [
                                { name: 'Kepler-10', distance: 0, size: 162147 },
                                ...system.payload.planets.map((planet: PlanetData) => ({
                                    name: planet.properties[0].name,
                                    distance: Math.random() * 10e7
                                }))
                            ]
                        ]} lifeZones={[
                            { from: 90e6, to: 250e6 },
                            { from: 90e6, to: 250e6 }
                        ]} />
                        <Subsubtitle>
                            Interaktivní model
                        </Subsubtitle>
                        <Subtitle>
                            Reference
                        </Subtitle>
                        <References items={[
                            ...system.payload.properties,
                            ...(system.payload.light_curves || []),
                            ...system.payload.planets
                        ] as any} />
                        <Subtitle>
                            Aktivity
                        </Subtitle>
                        <History>
                            <HTable>
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
                            </HTable>
                        </History>
                    </Main>
                </Root>
            )}
        />
    )

}

export default SystemView