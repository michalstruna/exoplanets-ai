import React from 'react'
import Styled from 'styled-components'
import { Value } from '../..'

import { useStrings } from '../../../Data'
import { Fraction, PlainTable } from '../../../Layout'
import { Numbers } from '../../../Native'
import { SystemData } from '../../types'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    data: SystemData
    refMap?: any
}

const Root = Styled(PlainTable)`
    align-self: flex-start;
    width: 22rem;
`

const StarTable = ({ data, refMap, ...props }: Props) => {

    const strings = useStrings().stars

    return (
        <Root {...props}>
            <tbody>
                <tr>
                    <th colSpan={2}>{strings.location}</th>
                </tr>
                <tr>
                    <td>{strings.distance}</td>
                    <td>
                        {Value.Star.props(data, 'distance', { refMap, unit: 'pc' })}
                    </td>
                </tr>
                <tr>
                    <td>{strings.ra}</td>
                    <td>
                        {Value.Star.props(data, 'ra', { refMap, format: Numbers.formatHours })}
                    </td>
                </tr>
                <tr>
                    <td>{strings.dec}</td>
                    <td>
                        {Value.Star.props(data, 'dec', { refMap, format: Numbers.formatDeg })}
                    </td>
                </tr>
                <tr>
                    <td>Souhvězdí</td>
                    <td>
                        {Value.Star.props(data, 'constellation', { refMap })}
                    </td>
                </tr>
                <tr>
                    <th colSpan={2}>{strings.surface}</th>
                </tr>
                <tr>
                    <td>{strings.surfaceTemperature}</td>
                    <td>
                        {Value.Star.props(data, 'surface_temperature', { refMap, unit: 'K' })}
                    </td>
                </tr>
                <tr>
                    <td>{strings.apparentMagnitude}</td>
                    <td>
                        {Value.Star.props(data, 'apparent_magnitude', { refMap, format: Numbers.format })}
                    </td>
                </tr>
                <tr>
                    <td>{strings.absoluteMagnitude}</td>
                    <td>
                        {Value.Star.props(data, 'absolute_magnitude', { refMap, format: Numbers.format })}
                    </td>
                </tr>
                <tr>
                    <td>{strings.luminosity}</td>
                    <td>
                        {Value.Star.props(data, 'luminosity', { refMap, unit: <>L<sub>☉</sub></> })}
                    </td>
                </tr>
                <tr>
                    <th colSpan={2}>{strings.matter}</th>
                </tr>
                <tr>
                    <td>{strings.diameter}</td>
                    <td>
                        {Value.Star.props(data, 'diameter', { refMap, unit: <>d<sub>☉</sub></> })}
                    </td>
                </tr>
                <tr>
                    <td>{strings.mass}</td>
                    <td>
                        {Value.Star.props(data, 'mass', { refMap, unit: <>M<sub>☉</sub></> })}
                    </td>
                </tr>
                <tr>
                    <td>{strings.density}</td>
                    <td>
                        {Value.Star.props(data, 'density', { refMap, unit: <Fraction top='kg' bottom={<>m<sup>3</sup></>} /> })}
                    </td>
                </tr>
                <tr>
                    <td>{strings.surfaceGravity}</td>
                    <td>
                        {Value.Star.props(data, 'surface_gravity', { refMap, unit: <Fraction top='m' bottom={<>s<sup>2</sup></>} /> })}
                    </td>
                </tr>
                <tr>
                    <th colSpan={2}>{strings.other}</th>
                </tr>
                <tr>
                    <td>{strings.metallicity}</td>
                    <td>
                        {Value.Star.props(data, 'metallicity', { refMap })}
                    </td>
                </tr>
                <tr>
                    <td>{strings.age}</td>
                    <td>
                        {Value.Star.props(data, 'age', { refMap, unit: 'mld. years' })}
                    </td>
                </tr>
            </tbody>
        </Root>
    )

}
export default StarTable