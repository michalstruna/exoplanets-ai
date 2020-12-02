import React from 'react'
import Styled from 'styled-components'

import { Block } from '../../../Layout'
import { useGlobalStats, usePlotStats, getPlotStats, getGlobalStats } from '../../index'
import { Async } from '../../../Async'
import { Media } from '../../../Style'
import ProgressStats from './ProgressStats'
import GlobalStats from './GlobalStats'
import PlotStats from './PlotStats'

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

const Root = Styled(Block)`
    display: flex;
    flex: 0 0 38rem;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    
    & > div {
        margin-bottom: 0.5rem;
        
        &:last-of-type {
            margin-bottom: 0;
        }
    }
    
    @media ${Media.SmallGs} {
        flex: 0 0 32rem;
    }
`

const GlobalStatsPanel = ({ ...props }: Props) => {

    const globalStats = useGlobalStats()
    const plotStats = usePlotStats()

    return (
        <Root {...props}>
            <Async
                data={[[plotStats, getPlotStats], [globalStats, getGlobalStats]]}
                success={() => (
                    <>
                        <GlobalStats value={globalStats.payload} />
                        <PlotStats value={plotStats.payload} />
                        <ProgressStats value={plotStats.payload.progress} />
                    </>
                )} />
        </Root>
    )

}

export default GlobalStatsPanel