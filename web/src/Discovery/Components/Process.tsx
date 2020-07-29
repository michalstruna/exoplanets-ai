import React from 'react'
import Styled from 'styled-components'

import { Color } from '../../Style'
import { IconText, Log } from '../../Layout'
import { ProcessData } from '../types'
import OsLabel from './OsLabel'
import { useActions, useStrings } from '../../Data'
import TimeAgo from '../../Native/Components/TimeAgo'
import { Socket } from '../../Async'
import { updateProcess } from '../Redux/Slice'
import ProcessState from '../Constants/ProcessState'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    data: ProcessData
}

const Root = Styled.div`
    background-color: ${Color.MEDIUM_DARK};
    box-sizing: border-box;
    display: flex;
    margin: 1rem 0;
`

const Main = Styled.div`
    box-sizing: border-box;
    padding: 1rem;
    width: calc(100% - 10rem);
`

const Row = Styled.div`
    align-items: center;
    display: flex;
    padding-bottom: 0.5rem;
    width: 100%;
    
    & > * {
        flex: 1 1 0;
    }
    
    & > div > div:last-of-type {
        width: calc(100% - 2rem);
        
        & > div {
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
    
    button {
        text-align: left;
    }
`

const ControlRow = Styled(Row)`
    border-top: 1px solid #555;
    height: 1.5rem;
    margin-bottom: -0.4rem;
    padding-top: 0.6rem;
    padding-bottom: 0;
    overflow: hidden;
`

const Name = Styled.div`
    font-size: 150%;
    font-weight: bold;
    margin-bottom: 0.5rem;
`

const DiscoveryLog = Styled(Log)`
    height: 15rem;
`

interface MessageProps {
    red?: boolean
}

const Message = Styled.p<MessageProps>`
    color: ${props => props.red ? Color.RED : Color.YELLOW};
    font-size: 85%;
    line-height: 1.4rem;
`

const getIconByState = (state: ProcessState) => {
    switch (state) {
        case ProcessState.TERMINATED:
            return 'Inactive'
        case ProcessState.PAUSED:
        case ProcessState.WAITING_FOR_RUN:
            return 'Semiactive'
        default:
            return 'Active'
    }
}

const immediateTerminateStates = [ProcessState.PAUSED, ProcessState.WAITING_FOR_RUN]

const Process = ({ data, ...props }: Props) => {

    const strings = useStrings().discovery.process
    const actions = useActions({ updateProcess })

    const memoControls = React.useMemo(() => {
        const handleRun = () => {
            Socket.emit('web_run_client', data.id)
            actions.updateProcess([data.id, { state: ProcessState.WAITING_FOR_RUN }])
        }

        const handlePause = () => {
            Socket.emit('web_pause_client', data.id)
            actions.updateProcess([data.id, { state: immediateTerminateStates.includes(data.state) ? ProcessState.PAUSED : ProcessState.WAITING_FOR_PAUSE }])
        }

        const handleStop = () => {
            Socket.emit('web_terminate_client', data.id)
            actions.updateProcess([data.id, { state: immediateTerminateStates.includes(data.state) ? ProcessState.TERMINATED : ProcessState.WAITING_FOR_TERMINATE }])
        }

        switch (data.state) {
            case ProcessState.ACTIVE:
            case ProcessState.WAITING_FOR_RUN:
                return (
                    <>
                        <IconText icon='Controls/Pause.svg' text={'Pozastavit'} onClick={handlePause} />
                        <IconText icon='Controls/Stop.svg' text={'Ukončit'} onClick={handleStop} />
                    </>
                )
            case ProcessState.PAUSED:
                return (
                    <>
                        <IconText icon='Controls/PlayGreen.svg' text={'Spustit'} onClick={handleRun} />
                        <IconText icon='Controls/Stop.svg' text={'Ukončit'} onClick={handleStop} />
                    </>
                )
            default:
                return (
                    <Message red={data.state === ProcessState.TERMINATED}>
                        {strings.stateMessage[data.state]}
                    </Message>
                )
        }
    }, [data.id, data.state, actions])

    return (
        <Root {...props}>
            <Main>
                <Row>
                    <Name>
                        {data.name}
                    </Name>
                    <IconText
                        icon={`Controls/${getIconByState(data.state)}.svg`}
                        text={strings.state[data.state]}
                        value={<TimeAgo time={data.start + data.pause_total}
                                        refTime={data.pause_start || undefined} />} />
                </Row>
                <Row>
                    <OsLabel os={data.os} />
                    <IconText icon='Discovery/Process/CPU/Intel.svg' text='CPU' value={data.cpu} title={data.cpu} />
                </Row>
                <Row>
                    <IconText icon='Discovery/Process/Processing.svg' text='% vašeho výkonu' value={50} />
                    <IconText icon='Discovery/Process/Processing.svg' text='% celkového výkonu' value={0.051} />
                </Row>
                <Row>
                    <IconText icon='Discovery/Process/Star.svg' text={'Analyzovaných hvězd'} value={1363} />
                    <IconText icon='Discovery/Process/Planet.svg' text={'Objevených planet'} value={1} />
                </Row>
                <ControlRow>
                    {memoControls}
                </ControlRow>
            </Main>
            <DiscoveryLog messages={data.logs.map(() => ({ time: 1592202214316, text: 'Úspěšné spuštění (Michal Struna).' }))}/>
        </Root>
    )

}

export default Process

/**
 * Název?
 * OS, CPU (GPU?)
 * Aktuální činnost (konzole, posledních 50 činností?)
 * Začátek, doba běhu, prozkoumaných hvězd, objevených kandidátů
 * Zastavit/spustit button, Ukončit button
 */