import React from 'react'
import Styled from 'styled-components'

import { Color, Dimension, size } from '../../Style'
import { Block, Table } from '../../Layout'
import { UsersBlock } from '../../User'
import PlanetsRank from '../Components/PlanetsRank'
import Chat from '../../User/Components/Chat'
import GlobalStatsPanel from '../Components/GlobalStatsPanel'

interface Props {

}

const Root = Styled.div`
    ${size('100%', `calc(100vh - ${Dimension.NAV_HEIGHT})`)}
    background-color: ${Color.BACKGROUND};
    display: flex;
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

const randomPlanets = [] as any

for (let i = 0; i < 20; i++) {
    randomPlanets.push({
        mass: Math.max(1, Math.ceil(Math.random() * 150) * Math.pow(10, Math.round(Math.random() * 5 + 5))),
        period: Math.ceil(Math.random() * 720),
        method: Math.round(Math.random() * 5).toString()
    })
}

const OverviewView = ({ ...props }: Props) => {

    return (
        <Root {...props}>
            <GlobalStatsPanel />
            <Center>
                <Todo>

                </Todo>
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