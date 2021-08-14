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
    const planets = useStrings().planets

    return (
        <Root {...props}>
            <tbody>
            <tr>
                <th colSpan={2}>{strings.matter}</th>
                <th colSpan={2}>{strings.orbit}</th>
                <th colSpan={2}>{strings.other}</th>
            </tr>
            <tr>
                <td>{planets.diameter}</td>
                <td>{Value.Planet.props(data, 'diameter', { refMap, unit: <>d<sub>⊕</sub></> })}</td>
                <td>{planets.period}</td>
                <td>{Value.Planet.props(data, ['orbit', 'period'], { refMap, unit: 'd' })}</td>
                <td>{planets.lifeConditions}</td>
                <td>{Value.Planet.props(data, 'life_conditions', { refMap })}</td>
            </tr>
            <tr>
                <td>{planets.mass}</td>
                <td>{Value.Planet.props(data, 'mass', { refMap, unit: <>M<sub>⊕</sub></>, isEstimate: props => props.processed })}</td>
                <td>{planets.semiMajorAxis}</td>
                <td>{Value.Planet.props(data, ['orbit', 'semi_major_axis'], { refMap, unit: 'au' })}</td>
                <td>{planets.surfaceTemperature}</td>
                <td>{Value.Planet.props(data, 'surface_temperature', { refMap, unit: '°C', isEstimate: props => props.processed })}</td>
            </tr>
            <tr>
                <td>{planets.density}</td>
                <td>{Value.Planet.props(data, 'density', { refMap, unit: <Fraction top='kg' bottom={<>m<sup>3</sup></>} />, isEstimate: props => props.processed })}</td>
                <td>{planets.inclination}</td>
                <td>{Value.Planet.props(data, ['orbit', 'inclination'], { refMap, unit: '°' })}</td>
                <td>{planets.status}</td>
                <td>{planets.statuses[data.status]}</td>
            </tr>
            <tr>
                <td>{planets.surfaceGravity}</td>
                <td>{Value.Planet.props(data, 'surface_gravity', { refMap, unit: <Fraction top='m' bottom={<>s<sup>2</sup></>} />, isEstimate: props => props.processed })}</td>
                <td>{planets.eccentricity}</td>
                <td>{Value.Planet.props(data, ['orbit', 'eccentricity'], { refMap, format: Numbers.format })}</td>
                <td>{planets.velocity}</td>
                <td>{Value.Planet.props(data, ['orbit', 'velocity'], { refMap, unit: <Fraction top='km' bottom='s' /> })}</td>
            </tr>
            </tbody>
        </Root>
    )

}
export default PlanetTable