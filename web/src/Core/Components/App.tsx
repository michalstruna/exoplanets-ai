import React from 'react'
import ReactDOM from 'react-dom'
import useRouter from 'use-react-router'

import GlobalStyle from './GlobalStyle'
import { useElement, Validator } from '../../Native'
import Header from './Header'
import Tooltip from '../../Layout/Components/Tooltip'
import { Sockets } from '../index'
import { MessageSelection, MessageTag, useIdentity } from '../../User'
import { FilterData, useActions, useSelector } from '../../Data'
import { getMessages } from '../../User'

interface Props extends React.ComponentPropsWithoutRef<any> {

}

const mapMessFilter: Record<MessageSelection, FilterData | undefined> = {
    [MessageSelection.ALL]: undefined,
    [MessageSelection.MESSAGES]: { attribute: ['tag'], relation: [Validator.Relation.EQUALS], value: [MessageTag.MESSAGE] },
    [MessageSelection.NOTIFICATIONS]: { attribute: ['tag'], relation: [Validator.Relation.CONTAINS], value: [`^(?!${MessageTag.MESSAGE}$)`] },
    [MessageSelection.DATASETS]: { attribute: ['tag'], relation: [Validator.Relation.EQUALS], value: [MessageTag.NEW_DATASET] },
    [MessageSelection.USERS]: { attribute: ['tag'], relation: [Validator.Relation.EQUALS], value: [MessageTag.NEW_VOLUNTEER] },
    [MessageSelection.PLANETS]: { attribute: ['tag'], relation: [Validator.Relation.EQUALS], value: [MessageTag.NEW_PLANET] },
}

const App = ({ children }: Props) => {

    const { nav } = useElement()
    const identity = useIdentity()
    const messageSelection = useSelector(state => state.user.messageSelection)
    const actions = useActions({ getMessages })
    const { location } = useRouter()

    React.useEffect(() => {
        Sockets.init(identity.payload)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    React.useEffect(() => { // On change tag, fetch chat messages.
        actions.getMessages({ segment: { index: 0, size: 50 }, filter: mapMessFilter[messageSelection] })
    }, [messageSelection, actions])

    React.useEffect(() => {
        const container = document.querySelector<HTMLElement>('#app')
        const offsetTop = location.hash ? document.querySelector<HTMLElement>(location.hash)?.offsetTop : 0
        container!.scrollTop = offsetTop || 0
    }, [location.hash])

    return (
        <>
            <GlobalStyle />
            {ReactDOM.createPortal(<Header />, nav.current as any)}
            {children}
            <Tooltip.Area />
        </>
    )
}

export default App