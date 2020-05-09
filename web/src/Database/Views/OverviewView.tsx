import React from 'react'
import Styled from 'styled-components'

import { Color, Dimension, size } from '../../Style'
import { Chart, TopLevelStats } from '../../Stats'
import { Table, ToggleLine } from '../../Layout'
import { Url } from '../../Routing'
import { UsersBlock } from '../../User'
import PlanetsRank from '../Components/PlanetsRank'
import Chat from '../../User/Components/Chat'

interface Static {

}

interface Props {

}

const Root = Styled.div`
    ${size('100%', `calc(100vh - ${Dimension.NAV_HEIGHT})`)}
    background-color: ${Color.BACKGROUND};
    display: flex;
`

const Block = Styled.div`
    background-color: ${Color.MEDIUM_DARK};
    box-sizing: border-box;
    padding: 1rem;
`

const Left = Styled(Block)`
    ${size('40rem', '100%')}
    
    & > div {
        margin-bottom: 0.5rem;
        
        &:last-of-type {
            margin-bottom: 0;
        }
    }
`

const Center = Styled.div`
    ${size('32rem', '100%')}
    margin: 0 1.5rem;
`

const Right = Styled.div`
    ${size('calc(100vw - 40rem - 32rem)', '100%')}
    margin-right: 1rem;
`

const Todo = Styled(Block)`
    ${size('100%', `calc(100% - 35rem)`)}
`

const OverviewUsersBlock = Styled(UsersBlock)`
    ${size('100%', `32rem`)}
    margin-top: 1.5rem;
`

const ChatBlock = Styled(Chat)`
    ${size('100%', `calc(100% - 32rem)`)}
    margin-top: 1.5rem;
`

const PlanetsRankBlock = Styled(PlanetsRank)`
    ${size('100%', '29rem')}
    padding: 0;
    
    ${Table.Root} {
        width: calc(100% - 3rem);
    }
`

const FlexContainer = Styled.div`
    display: flex;
    overflow: hidden;
    
    & > * {
        flex: 1 1 0;
        margin-right: 1rem;
        
        &:last-of-type {
            margin-right: 0;
        }
    }
`

const randomPlanets = [] as any

for (let i = 0; i < 20; i++) {
    randomPlanets.push({
        mass: Math.max(1, Math.ceil(Math.random() * 150) * Math.pow(10, Math.round(Math.random() * 5 + 5))),
        period: Math.ceil(Math.random() * 720),
        method: Math.round(Math.random() * 5).toString()
    })
}

const barData = [
    { size: '< 0.5', count: 163 },
    { size: '0.5-2', count: 463 },
    { size: '2-6', count: 599 },
    { size: '6-15', count: 415 },
    { size: '> 15', count: 160 }
]


const OverviewView: React.FC<Props> & Static = ({ ...props }) => {

    return (
        <Root {...props}>
            <Left>
                <TopLevelStats data={{
                    discoveredPlanets: 16,
                    exploredStars: 2793,
                    computingTime: 5235.231465,
                    volunteers: 123
                }} />
                <Chart
                    type={Chart.Type.SCATTER}
                    items={randomPlanets}
                    x={{ name: 'period', title: 'Perioda [dny]' }}
                    y={{ name: 'mass', title: 'Hmotnost [kg]', log: true }}
                    z={{ name: 'method' }} />

                <FlexContainer>
                    <Chart
                        type={Chart.Type.BAR}
                        items={barData}
                        x={{ name: 'size', title: 'Poloměr [poloměr Země]' }}
                        y={{ name: 'count', title: 'Počet' }} />
                    <div>
                        Zemi nejpodobnější exoplanety
                    </div>
                </FlexContainer>

                Objevených planet celkem | transit | radial velocity
                <br />
                Z toho potenciálně obyvatelných
                Zkontrolovaných hvězd
                Tabulka spektrálních tříd a objeveých exoplanet
            </Left>
            <Center>
                <Todo />
                <OverviewUsersBlock />
            </Center>
            <Right>
                <PlanetsRankBlock />
                <ChatBlock />
            </Right>
        </Root>
    )

}

export default OverviewView