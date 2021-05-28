import React from 'react'
import Styled from 'styled-components'

import { Color, Dimension, size } from '../../Style'
import { UsersBlock } from '../../User'
import PlanetRanks from '../Components/PlanetRanks'
import GlobalStatsPanel from '../Components/GlobalStats/GlobalStatsPanel'
import { DiscoveryBlock } from '../../Discovery' 

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
    overflow: hidden;
    padding: 1.5rem;
    padding-top: 0;
`

const Bottom = Styled.div`
    box-sizing: border-box;
    flex: 0 0 32rem;
    display: flex;
    padding-top: 1.5rem;
    width: 100%;
`

const OverviewUsersBlock = Styled(UsersBlock)`
    ${size('100%', `32rem`)}
    flex: 1 0 0;
    margin-right: 1.5rem;
    min-width: 28rem;
`

const PlanetRanksBlock = Styled(PlanetRanks)`
    ${size('100%', '32rem')}
    flex: 1.5 0 0;
    padding: 0;
`

const OverviewView = ({ ...props }: Props) => {

    return (
        <Root {...props}>
            <GlobalStatsPanel />
            <Right>
                <DiscoveryBlock />
                <Bottom>
                    <OverviewUsersBlock />
                    <PlanetRanksBlock />
                </Bottom>
            </Right>
        </Root>
    )

}

export default OverviewView