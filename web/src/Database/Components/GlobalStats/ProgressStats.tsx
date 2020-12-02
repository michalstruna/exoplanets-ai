import React from 'react'
import Styled from 'styled-components'
import { Numbers } from '../../../Native'
import { Url } from '../../../Routing'
import { ToggleLine } from '../../../Layout'
import { ImagePlot, PlotStat } from '../../../Stats'
import { useStrings } from '../../../Data'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    value: PlotStat
}

const ProgressContainer = Styled(ToggleLine)`
    height: auto;
    margin: 0 auto;
    width: 100%;
    
    ${ToggleLine.ItemHeader} {
        display: none;
    }
    
    ${ToggleLine.Item} {
        background-color: transparent !important;
        margin: 0 auto;
        position: relative;
        max-width: 27rem;
    }
`

const Progress = Styled.div`
    align-items: center;
    display: flex;
    justify-content: center;
`

const ProgressChart = Styled(ImagePlot)` 
    flex: 0 0 8rem;
`

const ProgressMessage = Styled.div`
    flex: 1 1 0;
`

const ProgressStats = ({ value, ...props }: Props) => {

    const strings = useStrings().discovery.stats

    return (
        <ProgressContainer items={[
            {
                header: '', content: (
                    <Progress>
                        <ProgressChart
                            data={value}
                            x={{ show: false }}
                            y={{ show: false }}
                            overlay={Numbers.formatPercentage(value.y.vals![0])} />
                        <ProgressMessage>
                            <b>{strings.join}</b><br />{strings.remains} {Numbers.formatPercentage(value.y.vals![1])} {strings.data}
                        </ProgressMessage>
                    </Progress>
                ), link: { pathname: Url.DISCOVERY }
            }
        ]} />
    )

}

export default ProgressStats