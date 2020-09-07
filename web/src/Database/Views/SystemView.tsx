import React from 'react'
import Styled from 'styled-components'

import DetailContent from '../Components/DetailContent'
import { MinorSectionTitle, PageTitle, SectionTitle, Tags } from '../../Layout'
import SizeVisualization from '../Components/SizeVisualization'
import DistanceVisualization from '../Components/DistanceVisualization'
import { Async } from '../../Async'
import { useSystem, getSystem } from '..'
import useRouter from 'use-react-router'
import { Planet } from '../types'

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
`

const Title = Styled(PageTitle)`
    
`

const Subtitle = Styled(SectionTitle)`

`

const Subsubtitle = Styled(MinorSectionTitle)`

`

const SystemView = ({ ...props }: Props) => {

    const systemName = useRouter<any>().match.params.system
    const system = useSystem()

    return (
        <Async
            data={[system, () => getSystem(systemName), [systemName]]}
            success={() => (
                <Root {...props}>
                    <DetailContent sections={[
                        { name: 'xx', text: 'Souhrn' },
                        { name: '', text: 'Hvězda' },
                        {
                            name: '',
                            text: 'Planety',
                            children: system.payload.planets.map((planet: Planet) => ({
                                name: planet.properties[0].name,
                                text: planet.properties[0].name
                            }))
                        },
                        {
                            name: '', text: 'Vizualizace', children: [
                                { name: '', text: 'Velikosti' },
                                { name: '', text: 'Vzdálenosti' },
                                { name: '', text: 'Interaktivní model' }
                            ]
                        },
                        { name: '', text: 'Reference' },
                        { name: '', text: 'Aktivity' }
                    ]} />
                    <Main>
                        <Title>
                            Kepler-10
                        </Title>
                        <Tags items={[
                            { text: 'KIC 11904151' },
                            { text: 'KOI-72' },
                            { text: '2MASS J19024305+5014286' },
                            { text: 'Gaia DR2 2132155017099178624' }
                        ]} />
                        <Subtitle>
                            Hvězda
                        </Subtitle>
                        <Subtitle>
                            Planety
                        </Subtitle>
                        {system.payload.planets.map((planet: Planet, i: number) => (
                            <Subsubtitle key={i}>
                                {planet.properties[0].name}
                            </Subsubtitle>
                        ))}
                        <Subtitle>
                            Vizualizace
                        </Subtitle>
                        <Subsubtitle>
                            Velikosti
                        </Subsubtitle>
                        <SizeVisualization systems={[
                            [
                                { name: 'Slunce', size: 1392684, image: '/img/Database/Star/F.svg' },
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
                                { name: 'Kepler-10', size: 162147, image: '/img/Database/Star/F.svg' },
                                ...system.payload.planets.map((planet: Planet) => ({
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
                                ...system.payload.planets.map((planet: Planet) => ({
                                    name: planet.properties[0].name,
                                    distance: Math.random() * 10e9
                                }))
                            ]
                        ]} lifeZones={[
                            { from: 100e6, to: 230e6 },
                            { from: 100e6, to: 230e6 }
                        ]} />
                        <Subsubtitle>
                            Interaktivní model
                        </Subsubtitle>
                        <Subtitle>
                            Reference
                        </Subtitle>
                        <Subtitle>
                            Aktivity
                        </Subtitle>
                    </Main>
                </Root>
            )}
        />
    )

}

export default SystemView