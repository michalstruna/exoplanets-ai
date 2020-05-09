import React from 'react'
import Styled from 'styled-components'
import { Color, image, opacityHover, size } from '../../Style'
import { Field, Form } from '../../Form'
import { useOnlineUsers } from '..'

interface Static {

}

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

const Message = Styled.div`
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


interface ChatData {
    message: string
}

const Chat: React.FC<Props> & Static = ({ ...props }) => {

    const users = useOnlineUsers()

    const handleSend = () => {

    }

    const renderedInput = (
        <Input defaultValues={{ message: '' }} onSubmit={handleSend}>
            <Field name='message' type={Field.Type.TEXT} label={'Napište něco...'} />
            <button />
        </Input>
    )

    const user = users.payload?.[4]

    return (
        <Root {...props}>
            <Messages>
                {user && new Array(30).fill(null).map(() => (
                    <Message>
                        <MessageImage style={{ backgroundImage: `url(${user.avatar})` }} />
                        <MessageContent>
                            <MessageAuthor>
                                {user.name}
                            </MessageAuthor>
                            <MessageText>
                                {'abc ab hdd'.repeat(Math.floor(Math.random() * 10))}
                            </MessageText>
                        </MessageContent>
                    </Message>
                ))}
            </Messages>
            {renderedInput}
        </Root>
    )

}

export default Chat