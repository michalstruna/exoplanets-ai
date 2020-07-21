import React from 'react'
import ReactDOM from 'react-dom'

import GlobalStyle from './GlobalStyle'
import { useElement } from '../../Native'
import Header from './Header'
import Tooltip from '../../Layout/Components/Tooltip'
import { Sockets } from '../index'

interface Props extends React.ComponentPropsWithoutRef<any> {

}

const App = ({ children }: Props) => {

    const { nav } = useElement()

    React.useEffect(() => {
        Sockets.init()
    }, [])

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