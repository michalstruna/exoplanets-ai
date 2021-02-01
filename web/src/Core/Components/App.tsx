import React from 'react'
import ReactDOM from 'react-dom'

import GlobalStyle from './GlobalStyle'
import { useElement, Validator } from '../../Native'
import Header from './Header'
import Tooltip from '../../Layout/Components/Tooltip'
import { Sockets } from '../index'
import { MessageSelection, MessageTag, useIdentity } from '../../User'
import { FilterData, useActions } from '../../Data'
import { getMessages } from '../../User'
import { useSelector } from 'react-redux'

interface Props extends React.ComponentPropsWithoutRef<any> {

}

const mapMessFilter: Record<MessageSelection, FilterData | undefined> = {
    [MessageSelection.ALL]: undefined,
    [MessageSelection.MESSAGES]: { attribute: ['text'], relation: [Validator.Relation.GREATER_THAN], value: [''] },
    [MessageSelection.NOTIFICATIONS]: { attribute: ['tag'], relation: [Validator.Relation.GREATER_THAN], value: [''] },
    [MessageSelection.DATASETS]: { attribute: ['tag'], relation: [Validator.Relation.EQUALS], value: [MessageTag.NEW_DATASET] },
    [MessageSelection.USERS]: { attribute: ['tag'], relation: [Validator.Relation.EQUALS], value: [MessageTag.NEW_VOLUNTEER] },
    [MessageSelection.PLANETS]: { attribute: ['tag'], relation: [Validator.Relation.EQUALS], value: [MessageTag.NEW_PLANET] },
}

const App = ({ children }: Props) => {

    const { nav } = useElement()
    const identity = useIdentity()
    const messageSelection = useSelector<any, MessageSelection>(state => state.user.messageSelection)
    const actions = useActions({ getMessages })

    React.useEffect(() => {
        Sockets.init(identity.payload)
    }, [])

    React.useEffect(() => { // On change tag, fetch chat messages.
        actions.getMessages({ segment: { index: 0, size: 50 }, filter: mapMessFilter[messageSelection] })
    }, [messageSelection]) // TODO: Filter by tag.

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