import React from 'react'
import Styled from 'styled-components'
import io from 'socket.io-client'

import DiscoveryTutorial from '../Components/DiscoveryTutorial'
import { Color } from '../../Style'

interface Props {

}

const Root = Styled.div`
    background-color: ${Color.BACKGROUND};
    overflow: hidden;
    min-height: 100%;
`

// TODO: Remove.
const socket = io('http://localhost:5000')

socket.on('connect', () => {
    socket.emit('web_init')
})


const DiscoveryView = ({ ...props }: Props) => {

    return (
        <Root {...props}>
            <DiscoveryTutorial />
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        </Root>
    )

}

export default DiscoveryView