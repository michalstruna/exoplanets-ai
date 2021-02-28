import React from 'react'
import Styled from 'styled-components'

import { useStrings } from '../../../Data'
import { FlexLine, PlainTable } from '../../../Layout'
import { Numbers } from '../../../Native'
import { Curve } from '../../../Stats'
import { LightCurveData } from '../../types'
import Ref from '../Ref'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    data: LightCurveData
    refMap?: any
    reverse?: boolean
}

const Meta = Styled(PlainTable)`
    width: 22rem;
`

const LightCurve = ({ data, refMap, ...props }: Props) => {

    const strings = useStrings().system

    return (
        <FlexLine {...props}>
            <Curve data={data} width={390} height={200} type={Curve.LC} />
            <Meta>
                <tbody>
                <tr>
                    <th colSpan={2}>
                        {data.dataset} {refMap && <Ref refMap={refMap} refs={data.dataset} />}
                    </th>
                </tr>
                <tr>
                    <td>{strings.nObservations}</td>
                    <td>{Numbers.format(data.n_observations)}</td>
                </tr>
                <tr>
                    <td>{strings.length}</td>
                    <td>{Numbers.format(data.n_days)} d</td>
                </tr>
                </tbody>
            </Meta>
        </FlexLine> 
    )

}
export default LightCurve