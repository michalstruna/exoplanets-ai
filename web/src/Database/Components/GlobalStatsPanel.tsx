import React from 'react'
import Styled from 'styled-components'

import { Curve, GlobalStats, ImagePlot } from '../../Stats'
import { Block } from '../../Layout'
import { useGlobalStats, usePlotStats, getGlobalStats, getPlotStats } from '..'
import { Async } from '../../Async'
import { useStrings } from '../../Data'

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

const Root = Styled(Block)`
    display: flex;
    flex: 0 0 38rem;
    flex-direction: column;
    justify-content: space-between;
    
    & > div {
        margin-bottom: 0.5rem;
        
        &:last-of-type {
            margin-bottom: 0;
        }
    }
`

const Horizontal = Styled.div`
    display: flex;
    
    & > div {
        flex: 1 1 0;
    }
`

const GlobalStatsPanel = ({ ...props }: Props) => {

    const globalStats = useGlobalStats()
    const plotStats = usePlotStats()
    const strings = useStrings()

    const { type_count, smax_mass, distance_count } = plotStats.payload || {}

    return (
        <Root {...props}>
            <Async
                data={[plotStats, getPlotStats]}
                success={() => (
                    <>
                        <GlobalStats />
                        <div>
                            <ImagePlot data={smax_mass} x={{ label: 'Velká poloosa [au]'}} y={{ label: 'Hmotnost [Mo]' }} />
                        </div>
                        <Horizontal>
                            <ImagePlot data={type_count} y={{ nTicks: 5, format: ImagePlot.INT_TICK }} x={{ label: 'Typ planety', nTicks: type_count.x.ticks.length + 1, format: v => strings.planets.types[v] }} />
                            <ImagePlot data={distance_count} y={{ nTicks: 5, format: ImagePlot.INT_TICK }} x={{ label: 'Vzdálenost od Země [ly]', nTicks: type_count.x.ticks.length + 1 }} />
                        </Horizontal>
                        <div>
                            <Curve data={{
                                name: 'MassSmax.png',
                                plot: 'History.png',
                                min_time: 0,
                                max_time: 10,
                                min_flux: 0,
                                max_flux: 20,
                                n_observations: 53147,
                                n_days: 531,
                                dataset: 'Info.com'
                            }} type={Curve.STATS} />
                        </div>
                    </>
                )} />
        </Root>
    )

}

export default GlobalStatsPanel