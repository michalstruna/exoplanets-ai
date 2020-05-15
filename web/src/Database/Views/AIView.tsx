import React from 'react'
import Styled from 'styled-components'
import io from 'socket.io-client'

interface Props {

}

const Root = Styled.div`

`

// TODO: Remove.
const socket = io('http://localhost:5000')

socket.on('connect', () => {
    socket.emit('web_init')
})


const AIView = ({ ...props }: Props) => {

    return (
        <Root {...props}>

        </Root>
    )

}

export default AIView