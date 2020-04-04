import React from 'react'
import Styled from 'styled-components'
import io from 'socket.io-client'

import LoginForm from '../../Auth/Components/LoginForm'

interface Static {

}

interface Props {

}

const Root = Styled.div`

`

// TODO: Remove.
const socket = io('http://localhost:5000')

socket.on('connect', () => {
    socket.emit('web_init')
})


const AIView: React.FC<Props> & Static = ({ ...props }) => {

    return (
        <Root {...props}>
            <LoginForm />
        </Root>
    )

}

export default AIView