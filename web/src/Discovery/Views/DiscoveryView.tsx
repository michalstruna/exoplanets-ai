import React from 'react'
import Styled from 'styled-components'

import DiscoveryTutorial from '../Components/DiscoveryTutorial'
import { Color } from '../../Style'
import Process from '../Components/Process'
import { useSelector } from '../../Data'

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

    const processes = useSelector(state => state.discovery.processes)

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