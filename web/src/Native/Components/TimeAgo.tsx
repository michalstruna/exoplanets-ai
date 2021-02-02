import React from 'react'
import Styled from 'styled-components'
import UseInterval from 'use-interval'

import { useStrings } from '../../Data'
import { Dates } from '../index'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    time: number
    refTime?: number
    exact?: boolean
    frequency?: number,
    format?: Dates.Format
}

const Root = Styled.div`
    display: inline-block;
    vertical-align: middle;
`

const TimeAgo = ({ time, frequency, exact, refTime, format, ...props }: Props) => {

    const strings = useStrings()
    const [ago, setAgo] = React.useState(Dates.formatDistance(strings, time, refTime, format))

    UseInterval(() => {
        setAgo(Dates.formatDistance(strings, time, refTime, format))
    }, frequency!)

    return (
        <Root title={Dates.formatDateTime(time)} {...props}>
            {ago}
        </Root>
    )

}

TimeAgo.defaultProps = {
    exact: false,
    frequency: 10000,
    format: Dates.Format.LONG
}

export default TimeAgo