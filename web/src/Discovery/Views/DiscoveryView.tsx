import React from 'react'
import Styled from 'styled-components'

import DiscoveryTutorial from '../Components/DiscoveryTutorial'
import { Color } from '../../Style'
import Process from '../Components/Process'
import { useProcesses } from '..'

interface Props {

}

const Root = Styled.div`
    background-color: ${Color.BACKGROUND};
    overflow: hidden;
    min-height: 100%;

    ${Process.Root} {
        height: 15rem;
    }
`

const Processes = Styled.div`
    margin: 0 auto;
    max-width: 60rem;
`

const DiscoveryView = ({ ...props }: Props) => {

    const processes = useProcesses()

    return (
        <Root {...props}>
            <DiscoveryTutorial />
            <Processes>
                {processes.map((process, i) => <Process key={process.id} data={process} />)}
            </Processes>
        </Root>
    )

}

export default DiscoveryView