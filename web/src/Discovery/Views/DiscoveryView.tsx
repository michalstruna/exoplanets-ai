import React from 'react'
import Styled from 'styled-components'
import io from 'socket.io-client'

import DiscoveryTutorial from '../Components/DiscoveryTutorial'
import { Color } from '../../Style'
import Process from '../Components/Process'

interface Props {

}

const Root = Styled.div`
    background-color: ${Color.BACKGROUND};
    overflow: hidden;
    min-height: 100%;
`

const Processes = Styled.div`
    margin: 0 auto;
    max-width: 60rem;
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
            <Processes>
                <Process />
                <Process />
                <Process />
                <Process />
                <Process />
                <Process />
            </Processes>
        </Root>
    )

}

export default DiscoveryView