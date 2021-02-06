import React from 'react'
import Styled from 'styled-components'

import { Block } from '../../Layout'
import { Color, Duration, image, opacityHover, size } from '../../Style'
import { useProcesses } from '../Redux/Selectors'
import DiscoveryTutorial from './DiscoveryTutorial'
import * as Platform from '../Utils/Platform'
import Process from './Process'

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

const Root = Styled.div`
    ${size()}
    display: flex;
    overflow: hidden;
`

const Tabs = Styled.div`
    display: flex;
    flex: 0 0 3rem;
    flex-direction: column;
`

const Body = Styled(Block)`
    align-items: center;
    align-self: stretch;
    display: flex;
    height: 100%;
    flex: 1 1 0;
    padding: 0;
    overflow: hidden;

    ${DiscoveryTutorial.Inner} {
        margin: 0;
        width: 100%;
        max-width: 100%;
    }

    ${Process.Root} {
        height: 100%;
    }
`

const Tab = Styled.button`
    ${image(undefined, '50% auto')}
    ${opacityHover()}
    flex: 1 1 0;
    transition: background-color ${Duration.FAST}, opacity ${Duration.FAST};

    &[data-active] {
        background-color: ${Color.MEDIUM_DARK};
        opacity: 1;
    }
`

const DiscoveryBlock = ({ ...props }: Props) => {

    const processes = useProcesses()
    const [tab, setTab] = React.useState(0)

    return (
        <Root {...props}>
            {processes.length > 0 && <Tabs>
                <Tab data-active={tab === 0 || undefined} onClick={() => setTab(0)} style={{ backgroundImage: 'url(/img/Discovery/Download.svg' }} />
                {processes.map((p, i) => (
                    <Tab
                        key={i}
                        data-active={i + 1 === tab || undefined}
                        onClick={() => setTab(i + 1)}
                        style={{ backgroundImage: `url(/img/${Platform.getOsIcon(p.os)})` }} />
                ))}
            </Tabs>}
            <Body>
                {tab === 0 ? <DiscoveryTutorial /> : <Process data={processes[tab - 1]} />}
            </Body>
        </Root>
    )

}
export default DiscoveryBlock