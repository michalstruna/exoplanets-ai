import React from 'react'
import Styled from 'styled-components'
import { ImagePlot, PlotStats as PlotStatsType } from '../../../Stats'
import { useStrings } from '../../../Data'

interface Props {
    value: PlotStatsType
}

const Horizontal = Styled.div`
    & > div {
        float: left;
        width: 50%;
    }

    ${ImagePlot.Vertical} {
        width: calc(100% - 2.5rem);
    }

    ${ImagePlot.TinyVertical} {
        width: 2.5rem;
    }
`

const PlotStats = ({ value }: Props) => {

    const strings = useStrings()
    const { smax_mass, type_count, distance_count } = value

    return (
        <>
            <div>
                <ImagePlot data={smax_mass} x={{ label: 'Velká poloosa [au]' }} y={{ label: 'Hmotnost [Mo]' }} />
            </div>
            <Horizontal>
                <ImagePlot data={type_count} y={{ nTicks: 5, format: ImagePlot.INT_TICK }} x={{
                    label: 'Typ planety',
                    nTicks: type_count.x.ticks!.length + 1,
                    format: v => strings.planets.types[v]
                }} />
                <ImagePlot data={distance_count} y={{ nTicks: 5, format: ImagePlot.INT_TICK }} x={{
                    label: 'Vzdálenost od Země [ly]',
                    nTicks: type_count.x.ticks!.length + 1
                }} />
            </Horizontal>
        </>
    )

}

export default PlotStats