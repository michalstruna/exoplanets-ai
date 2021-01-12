import React from 'react'
import Styled from 'styled-components'

import { Units, UnitType, UnitTypeData, useStrings } from '../../../Data'
import { GlobalAggregatedStats } from '../../../Stats'
import { Diff } from '../../../Layout'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    value: GlobalAggregatedStats
}

const Root = Styled.div`
    display: flex;
    flex-wrap: wrap;
    margin-top: -0.5rem;
    overflow: hidden;
    position: relative;
    width: 100%;
    min-height: 11rem;
`

const Item = Styled.div`
    box-sizing: border-box;
    padding: 0.5rem;
    width: 33.33%;
    
    &:nth-of-type(2n) {
    
    }
`

const Name = Styled.div`
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`

const Value = Styled.div`
    font-size: 180%;
    font-weight: bold;
    overflow: hidden;
`

const Interval = Styled.div`
    display: inline-block;
    font-size: 80%;
`

const StatDiff = Styled(Diff)`
    font-size: 90%;
    font-weight: bold;
`

const units: Record<string, UnitTypeData> = {
    time: UnitType.TIME,
    data: UnitType.MEMORY
}

const GlobalStats = ({ value, ...props }: Props) => {

    const strings = useStrings().stats

    return (
        <Root {...props}>
            {Object.entries(value).map(([key, item], i) => (
                <Item key={i}>
                    <Name>
                        {strings[key]}
                    </Name>
                    <StatDiff diff={item.diff} format={val => Units.format(val, units[key as keyof GlobalAggregatedStats])} /> <Interval>{strings.lastWeek}</Interval>
                    <Value>
                        {Units.format(item.value, units[key as keyof GlobalAggregatedStats])}
                    </Value>
                </Item>
            ))}
        </Root>
    )
}

GlobalStats.Item = Item
GlobalStats.ItemName = Name
GlobalStats.ItemValue = Value

export default GlobalStats