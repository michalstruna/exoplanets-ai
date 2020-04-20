import React from 'react'
import ReactDOM from 'react-dom'

import GlobalStyle from './GlobalStyle'
import { useElement } from '../../Utils'
import Header from './Header'

interface Static {

}

interface Props {

}

const App: React.FC<Props> & Static = ({ children }) => {

    const { nav } = useElement()

    return (
        <>
            <GlobalStyle />
            {ReactDOM.createPortal(<Header />, nav.current as any)}
            {children}
        </>
    )
}

export default App