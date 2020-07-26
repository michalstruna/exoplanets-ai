import React from 'react'
import Styled from 'styled-components'
import UseInterval from 'use-interval'

import { useStrings } from '../../Data'
import { Dates } from '../index'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    time: number
    refTime?: number
    exact?: boolean
    frequency?: number
}

const Root = Styled.div`
    display: inline-block;
    vertical-align: middle;
`

const TimeAgo = ({ time, frequency, exact, refTime, ...props }: Props) => {

    const strings = useStrings()
    const [ago, setAgo] = React.useState(Dates.formatDistance(strings, time, refTime, Dates.Format.LONG))

    UseInterval(() => {
        setAgo(Dates.formatDistance(strings, time, refTime, Dates.Format.LONG))
    }, frequency!)

    return (
        <Root title={Dates.formatDate(time)} {...props}>
            {ago}
        </Root>
    )

}

TimeAgo.defaultProps = {
    exact: false,
    frequency: 1000,
}

export default TimeAgo