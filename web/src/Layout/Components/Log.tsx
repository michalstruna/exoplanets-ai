import React from 'react'
import Styled from 'styled-components'

import { Dates } from '../../Native'
import { Color } from '../../Style'
import { User } from '../../User'

interface Message {
    text: string
    time?: number
    user?: User
}

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    messages: Message[]
    size?: number
}

const Root = Styled.div`
    font-family: Courier New;
    font-size: 90%;
    overflow-y: auto;
    width: 100%;
`

const Block = Styled.div`

`

const Time = Styled.time`
    background-color: ${Color.DARK};
    margin-right: 0.5rem;
    padding: 0.25rem;
`

const Log = ({ messages, ...props }: Props) => {

    const renderedMessages = React.useMemo(() => (
        messages.map((message, i) => (
            <Block key={i}>
                {message.time && <Time>{Dates.formatTime(message.time, true)}</Time>}
                {message.text}
            </Block>
        ))
    ), [messages])

    return (
        <Root {...props}>
            {renderedMessages}
        </Root>
    )

}

Log.Root = Root

export default Log