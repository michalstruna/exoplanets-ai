import React from 'react'
import Styled from 'styled-components'
import { useSelector } from 'react-redux'
import { FormContextValues } from 'react-hook-form'

import { Color, image, opacityHover, size } from '../../Style'
import { Field, Form } from '../../Form'
import { Message } from '../types'
import { useStrings } from '../../Data'
import { Socket } from '../../Async'

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

const Root = Styled.div`
    ${size()}
    background-color: ${Color.MEDIUM_DARK};
`

const Input = Styled(Form)`
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-top: 0.25rem;
    padding: 0.5rem;

    label {
        margin: 0;
        width: calc(100% - 4rem);
        
        p {
            color: ${Color.MEDIUM_LIGHT};
        }
    }

    button:not([type]) {
        ${image('User/Chat/Send.svg', '70%')}
        ${size('2.5rem')}
        ${opacityHover()}
        background-color: transparent !important;
        margin: 0;
    }

`

const Messages = Styled.div`
    ${size('100%', 'calc(100% - 4rem)')}
    box-sizing: border-box;
    overflow: hidden;
    overflow-y: auto;
    padding: 1rem;
`

const MessageBlock = Styled.div`
    display: flex;
    margin-top: 1rem;
`

const MessageImage = Styled.div`
    ${image(undefined)}
    ${size(('2rem'))}
`

const MessageContent = Styled.div`
    padding-left: 0.5rem;
    width: calc(100% - 2rem);
`

const MessageAuthor = Styled.div`
    font-size: 85%;
    font-weight: bold;
`

const MessageText = Styled.div`
    font-size: 90%;
    margin-top: 0.0rem;
`

type Values = {
    text: string
}

const Chat = ({ ...props }: Props) => {

    const messages = useSelector<any, Message[]>(state => state.user.messages)
    const strings = useStrings().users

    const handleSend = (values: Values, form: FormContextValues<Values>) => {
        if (values.text) {
            Socket.emit('new_message', values.text)
            form.reset()
        }
    }

    return (
        <Root {...props}>
            <Messages>
                {messages.map((message, i) => (
                    <MessageBlock key={i}>
                        <MessageImage style={{ backgroundImage: `url(${message.user?.avatar})` }} />
                        <MessageContent>
                            <MessageAuthor>
                                {message.user?.name}
                            </MessageAuthor>
                            <MessageText>
                                {'abc ab hdd'.repeat(Math.floor(Math.random() * 10))}
                            </MessageText>
                        </MessageContent>
                    </MessageBlock>
                ))}
            </Messages>
            <Input defaultValues={{ text: '' }} onSubmit={handleSend}>
                <Field name='text' type={Field.Type.TEXT} label={strings.type} required={strings.type} />
                <button />
            </Input>
        </Root>
    )

}

export default Chat