import React from 'react'
import Styled from 'styled-components'

import { Color } from '../../Style'
import { IconText, Console } from '../../Layout'
import { ProcessData, ProcessLog } from '../types'
import { useActions, useStrings } from '../../Data'
import { Socket } from '../../Async'
import { updateProcess } from '../Redux/Slice'
import ProcessState from '../Constants/ProcessState'
import * as Platform from '../Utils/Platform'
import { Dates, TimeAgo } from '../../Native'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    data: ProcessData
}

const Root = Styled.div`
    align-items: center;
    background-color: ${Color.MEDIUM_DARK};
    box-sizing: border-box;
    display: flex;
    margin: 1rem 0;
    width: 100%;

    ${Console.Root} {
        font-size: 90%;
        flex: 0 0 30rem;
    }
`

const Main = Styled.div`
    align-self: stretch;
    box-sizing: border-box;
    display: flex;
    flex: 1 1 0;
    flex-wrap: wrap;
    padding: 1rem;
`

const Row = Styled.div`
    align-items: center;
    display: flex;
    padding-bottom: 0.5rem;
    width: 100%;

    & > * {
        flex: 0 0 50%;
        justify-content: flex-start;
        width: 50%;
    }
    
    button {
        text-align: left;
    }
`

const ControlRow = Styled(Row)`
    border-top: 1px solid #555;
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

interface MessageProps {
    red?: boolean
}

const Message = Styled.p<MessageProps>`
    color: ${props => props.red ? Color.RED : Color.YELLOW};
    font-size: 85%;
    line-height: 1.4rem;
`

const LogLine = Styled.div`
    display: flex;
    line-height: 1.5rem;

    &:nth-of-type(2n) {
        background-color: ${Color.TRANSPARENT_DARKEST};
    }
`

const LogTime = Styled.time`
    background-color: ${Color.TRANSPARENT_DARKEST};
    flex: 0 0 7rem;
    font-family: Courier New;
    margin-right: 0.5rem;
    padding: 0 0.5rem;
`

const LogText = Styled.p`
    flex: 1 1 0;
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

    console.log(data)

    const logRenderer = (line: ProcessLog, i: number) => (
        <LogLine key={i}>
            <LogTime>
                {Dates.formatTime(line.created, true, true)}
            </LogTime>
            <LogText>
                {strings.log[line.type].join(line.values[0])}
            </LogText>
        </LogLine>
    )

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
                        <IconText icon='Controls/Pause.svg' text={strings.pause} onClick={handlePause} />
                        <IconText icon='Controls/Stop.svg' text={strings.terminate} onClick={handleStop} />
                    </>
                )
            case ProcessState.PAUSED:
                return (
                    <>
                        <IconText icon='Controls/PlayGreen.svg' text={strings.run} onClick={handleRun} />
                        <IconText icon='Controls/Stop.svg' text={strings.terminate} onClick={handleStop} />
                    </>
                )
            default:
                return (
                    <Message red={data.state === ProcessState.TERMINATED}>
                        {strings.stateMessage[data.state]}
                    </Message>
                )
        }
    }, [data.id, data.state, actions, strings])

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
                        value={<TimeAgo time={data.start + data.pause_total} refTime={data.pause_start || undefined} frequency={1000}  />} size={IconText.MEDIUM} />
                </Row>
                <Row>
                    <IconText icon={Platform.getOsIcon(data.os)} text='OS' value={data.os} title={data.os} size={IconText.MEDIUM} />
                    <IconText icon={Platform.getCpuIcon(data.cpu)} text='CPU' value={data.cpu} title={data.cpu} size={IconText.MEDIUM} />
                </Row>
                <Row>
                    <IconText icon='Discovery/Process/Curve.svg' text={strings.analyzedCurves} value={1363} size={IconText.MEDIUM} />
                    <IconText icon='Discovery/Process/Planet.svg' text={strings.discoveredPlanets} value={1} size={IconText.MEDIUM} />
                </Row>
                <ControlRow>
                    {memoControls}
                </ControlRow>
            </Main>
            <Console
                lines={data.logs}
                lineRenderer={logRenderer} />
        </Root>
    )

}

Process.Root = Root

export default Process