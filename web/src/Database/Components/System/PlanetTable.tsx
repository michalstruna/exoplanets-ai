import React from 'react'
import Styled from 'styled-components'
import { Value } from '../..'

import { useStrings } from '../../../Data'
import { Fraction, PlainTable } from '../../../Layout'
import { Numbers } from '../../../Native'
import { PlanetData } from '../../types'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    data: PlanetData
    refMap?: any
}

const Root = Styled(PlainTable)`

`

const PlanetTable = ({ data, refMap, ...props }: Props) => {

    const strings = useStrings().system
    const properties = strings.properties
    const planets = strings.planets

    return (
        <Root {...props}>
            <tbody>
            <tr>
                <th colSpan={2}>{strings.matter}</th>
                <th colSpan={2}>{strings.orbit}</th>
                <th colSpan={2}>{strings.other}</th>
            </tr>
            <tr>
                <td>{properties.diameter}</td>
                <td>{Value.Planet.props(data, 'diameter', { refMap, unit: <>d<sub>⊕</sub></> })}</td>
                <td>{properties.orbitalPeriod}</td>
                <td>{Value.Planet.props(data, 'orbital_period', { refMap, unit: 'd' })}</td>
                <td>{properties.lifeConditions}</td>
                <td>{Value.Planet.props(data, 'life_conditions', { refMap })}</td>
            </tr>
            <tr>
                <td>{properties.mass}</td>
                <td>{Value.Planet.props(data, 'mass', { refMap, unit: <>M<sub>⊕</sub></>, isEstimate: props => props.processed })}</td>
                <td>{properties.semiMajorAxis}</td>
                <td>{Value.Planet.props(data, 'semi_major_axis', { refMap, unit: 'au' })}</td>
                <td>{properties.surfaceTemperature}</td>
                <td>{Value.Planet.props(data, 'surface_temperature', { refMap, unit: '°C', isEstimate: props => props.processed })}</td>
            </tr>
            <tr>
                <td>{properties.density}</td>
                <td>{Value.Planet.props(data, 'density', { refMap, unit: <Fraction top='kg' bottom={<>m<sup>3</sup></>} />, isEstimate: props => props.processed })}</td>
                <td>{properties.orbitalVelocity}</td>
                <td>{Value.Planet.props(data, 'orbital_velocity', { refMap, unit: <Fraction top='km' bottom='s' /> })}</td>
                <td>{properties.status}</td>
                <td>{planets.statuses[data.status]}</td>
            </tr>
            <tr>
                <td>{properties.surfaceGravity}</td>
                <td>{Value.Planet.props(data, 'surface_gravity', { refMap, unit: <Fraction top='m' bottom={<>s<sup>2</sup></>} />, isEstimate: props => props.processed })}</td>
                <td>{properties.eccentricity}</td>
                <td>{Value.Planet.props(data, 'eccentricity', { refMap, format: Numbers.format })}</td>
                <td>???</td>
                <td>???</td>
            </tr>
            </tbody>
        </Root>
    )

}
export default PlanetTable