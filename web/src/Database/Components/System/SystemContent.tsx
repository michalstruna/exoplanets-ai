import React from 'react'

import { Value } from '../..'
import { useStrings } from '../../../Data'
import { PlanetData, SystemData } from '../../types'
import DetailContent from '../DetailContent'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    system: SystemData
}

const SystemContent = ({ system, ...props }: Props) => {

    const strings = useStrings().system

    return (
        <DetailContent {...props} title={strings.content} sections={[
            { name: 'top', text: (Value.Star.name(system) || '') },
            {
                name: '', text: strings.observations, children: [
                    { name: '', text: `${strings.lightCurve} (${system.light_curves.length || 0})` }
                ]
            },
            {
                name: '',
                text: strings.planets + ' (' + system.planets.length + ')',
                children: system.planets.map((planet: PlanetData) => ({
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
    )

}
export default SystemContent