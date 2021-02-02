import React from 'react'
import Styled, { css } from 'styled-components'
import { useSelector } from 'react-redux'
import { UseFormMethods } from 'react-hook-form'

import { Color, Duration, fadeIn, image, opacityHover, size } from '../../Style'
import { Field, Form } from '../../Form'
import { Message } from '../types'
import { AsyncData, useActions, useStrings } from '../../Data'
import { Async } from '../../Async'
import { addMessage, MessageSelection, useIdentity, setMessageSelection, UserName, MessageTag } from '..'
import { SegmentData } from '../../Database/types'
import { Dates } from '../../Native'
import { IconText } from '../../Layout'
import TimeAgo from '../../Native/Components/TimeAgo'

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

interface MessageBlockProps {
    own?: boolean
}

const Root = Styled.div`
    ${size()}
    background-color: ${Color.MEDIUM_DARK};
    position: relative;

    ${Form.Root} {
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
    }
`

const MessageContent = Styled.div`
    margin-left: 0.7rem;
`

const MessageHeader = Styled.div`
    display: flex;
    font-size: 80%;
    justify-content: flex-start;
    visibility: hidden;
`

const MessageDate = Styled(TimeAgo)`
    margin-left: 0.5rem;
    opacity: 0.5;
    visibility: visible;
`

const MessageText = Styled.div`
    background-color: #2A2A2A;
    border-radius: 0.5rem;
    border-top-left-radius: 0;
    box-sizing: border-box;
    display: inline-block;
    font-size: 90%;
    margin-top: 0.2rem;
    padding: 0.4rem 1rem;
    text-align: left;
    max-width: 80%;
`

const MessageBlock = Styled.div<MessageBlockProps>`
    display: flex;
    margin-top: 0.7rem;
    position: relative;
    min-height: 3rem;
    text-align: left;

    ${IconText.Icon} {
        margin-right: 0;
    }

    ${IconText.Text} {
        position: absolute;
        font-size: 80%;
        left: 3.75rem;
        top: 0;
    }

    ${props => props.own && `
        flex-direction: row-reverse;

        ${MessageContent} {
            margin-left: 0;
            margin-right: 0.7rem;
            text-align: right;
        }

        ${MessageHeader} {
            flex-direction: row-reverse;
        }

        ${IconText.Text} {
            left: auto;
            right: 3.75rem;
        }

        ${MessageDate} {
            margin-left: 0;
            margin-right: 0.5rem;
        }

        ${MessageText} {
            border-top-left-radius: 0.5rem;
            border-top-right-radius: 0;
        }
    `}
`

const NotificationBlok = Styled(MessageText)`
    background-color: ${Color.DARKEST};
    border-radius: 0.5rem;
    margin: 0 auto;
    margin-top: 0.7rem;
    padding: 0.5rem;
    max-width: calc(50% - 0.25rem);

    ${MessageHeader} {
        display: inline-flex;
        margin-bottom: 0.5rem;
        visibility: visible;
    }

    ${MessageHeader} {
        margin-left: 2.35rem;
        margin-bottom: 0
    }

    ${IconText.Root} {
        margin-top: -0.8rem;
    }

    ${IconText.Text} {
        vertical-align: bottom;
    }
`

const Selection = Styled.select`
    background-color: ${Color.MEDIUM_DARK};
    box-shadow: 0 0 0.25rem ${Color.DARKEST};
    border: none;
    margin-right: 0.5rem;
`

const Messages = Styled.div`
    ${size('100%', 'calc(100% - 4rem)')}
    animation: ${fadeIn} ${Duration.MEDIUM} 1;
    box-sizing: border-box;
    overflow: hidden;
    overflow-y: auto;
    padding: 1rem;
    text-align: center;

    ${NotificationBlok} + ${NotificationBlok} {
        margin-left: 0.5rem;
    }
`

type Values = {
    text: string
}

const Chat = ({ ...props }: Props) => {

    const messages = useSelector<any, AsyncData<SegmentData<Message>>>(state => state.user.messages)
    const globalStrings = useStrings()
    const strings = globalStrings.users
    const identity = useIdentity()
    const scrollable = React.useRef<HTMLDivElement>(null)
    const actions = useActions({ addMessage, setMessageSelection })
    const messageSelection = useSelector<any, MessageTag>(state => state.user.messageSelection)

    const handleSend = async (values: Values, form: UseFormMethods<Values>) => {
        if (!identity.payload) {
            form.setError('text', { message: strings.unauth })
        } else if (values.text) {
            const action = await actions.addMessage(values)

            if (action.error) {
                form.setError('text', { message: 'Chyba' })  // TODO: Error.
            } else {
                form.reset() // TODO: Remove?
            }
        }
    }

    React.useLayoutEffect(() => {
        const el = scrollable.current

        if (el) {
            setTimeout(() => {
                el.scrollTop = el.scrollHeight
            }, 10)
        }
    }, [scrollable, messages])

    const renderNotification = (message: Message) => {
        switch (message.tag) {
            case MessageTag.NEW_VOLUNTEER:
                return <UserName user={message.user!} />
            case MessageTag.NEW_DATASET:
                return <IconText icon='Core/Nav/Database.svg' text={message.text} size={IconText.MEDIUM} />
        }
    } 

    return (
        <Root {...props}>
            <Messages ref={scrollable}>
                <Async data={messages} success={() => (
                    messages.payload?.content.map((message, i) => message.tag !== MessageTag.MESSAGE ? (
                        <NotificationBlok key={i}>
                            <MessageHeader>
                                {strings.messageTag[message.tag]} <MessageDate time={message.created} format={Dates.Format.SHORT_NATURE} />
                            </MessageHeader>
                            {renderNotification(message)}
                        </NotificationBlok>
                    ) : (
                        <MessageBlock key={i} own={identity.payload && identity.payload._id === message.user!._id}>
                            <UserName user={message.user!} size='3rem' />
                            <MessageContent>
                                <MessageHeader>
                                    {message.user!.name} <MessageDate time={message.created} format={Dates.Format.SHORT_NATURE} />
                                </MessageHeader>
                                <MessageText>
                                    {message.text}
                                </MessageText>
                            </MessageContent>
                        </MessageBlock>
                    ))
                )} />
            </Messages>
            <Form defaultValues={{ text: '' }} onSubmit={handleSend}>
                <Selection onChange={e => actions.setMessageSelection(e.target.value as MessageSelection)} defaultValue={messageSelection}>
                    {Object.values(MessageSelection).map((selection, i) => (
                        <option value={selection} key={i}>{strings.messageSelection[selection]}</option>
                    ))}
                </Selection>
                <Field name='text' type={Field.Type.TEXT} label={strings.type} required={strings.type} maxLength={300} />
                <button />
            </Form>
        </Root>
    )

}

export default Chat