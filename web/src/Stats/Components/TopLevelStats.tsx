import React from 'react'
import Styled from 'styled-components'

import { ExtendedStats } from '../types'
import { useStrings } from '../../Data'
import { Numbers } from '../../Native'

interface Static {
    Item: string
    ItemName: string
    ItemValue: string
}

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    data: ExtendedStats
}

const Root = Styled.div`
    display: flex;
    overflow: hidden;
    width: 100%;
`

const Item = Styled.div`
    width: 25%;
`

const Name = Styled.div`
    word-spacing: 9999999px;
`

const Value = Styled.div`
    font-size: 200%;
    font-weight: bold;
    overflow: hidden;
    width: 100%;
`

const TopLevelStats: React.FC<Props> & Static = ({ data, ...props }) => {

    const strings = useStrings().stats.topLevelStats

    const renderedStats = React.useMemo(() => {

        return Object.keys(data).map((key, i) => (
            <Item key={i}>
                <Name>
                    {strings[key]}
                </Name>
                <Value>
                    {Numbers.format((data as any)[key])} {strings.units[key] || ''}
                </Value>
            </Item>
        ))
    }, [data, strings])

    return (
        <Root {...props}>
            {renderedStats}
        </Root>
    )
}

TopLevelStats.Item = Item
TopLevelStats.ItemName = Name
TopLevelStats.ItemValue = Value

export default TopLevelStats