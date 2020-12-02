import React from 'react'
import Styled from 'styled-components'

import { useStrings } from '../../../Data'
import { Numbers } from '../../../Native'
import { Color } from '../../../Style'
import { useGlobalStats, getGlobalStats } from '../../index'
import { Async } from '../../../Async'
import { AggregatedStats } from '../../../Stats'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    value: AggregatedStats
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

const Unit = Styled.div`
    font-size: 70%;
    display: inline-block; 
    
    &:empty {
        display: none;
    }
`

const Diff = Styled.div`
    color: ${Color.GREEN};
    display: inline-block;
    font-size: 90%;
    font-weight: bold;
`

const GlobalStats = ({ value, ...props }: Props) => {

    const strings = useStrings().stats

    return (
        <Root {...props}>
            {Object.entries(value).map(([key, item], i) => (
                <Item key={i}>
                    <Name>
                        {strings[key]}
                    </Name>
                    <Diff>+{Numbers.format(item.diff)} <Unit>{strings.units[key] || ''}</Unit></Diff> <Interval>{strings.lastWeek}</Interval>
                    <Value>
                        {Numbers.format(item.value)} <Unit>{strings.units[key] || ''}</Unit>
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