import React from 'react'
import Styled from 'styled-components'

import { Color, Dimension, size } from '../../Style'
import { Block } from '../../Layout'
import { UsersBlock } from '../../User'
import PlanetsRank from '../Components/PlanetsRank'
import GlobalStatsPanel from '../Components/GlobalStats/GlobalStatsPanel'

interface Props {

}

const Root = Styled.div`
    ${size('100%', `calc(100vh - ${Dimension.NAV_HEIGHT})`)}
    background-color: ${Color.BACKGROUND};
    display: flex;
`

const Right = Styled.div`   
    box-sizing: border-box;
    display: flex;
    flex: 1 0 0;
    flex-direction: column;
    padding: 1.5rem;
    padding-top: 0;
`

const Top = Styled.div`
    flex: 1 0 0;
`

const Bottom = Styled.div`
    box-sizing: border-box;
    flex: 0 0 32rem;
    display: flex;
    padding-top: 1.5rem;
    width: 100%;
`

const Todo = Styled(Block)`
    ${size()}
`

const OverviewUsersBlock = Styled(UsersBlock)`
    ${size('100%', `32rem`)}
    flex: 1 0 0;
    margin-right: 1.5rem;
    min-width: 28rem;
`

const PlanetsRankBlock = Styled(PlanetsRank)`
    ${size('100%', '32rem')}
    flex: 1.5 0 0;
    padding: 0;
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
            <Right>
                <Top>
                    <Todo />
                </Top>
                <Bottom>
                    <OverviewUsersBlock />
                    <PlanetsRankBlock />
                </Bottom>
            </Right>
        </Root>
    )

}

export default OverviewView