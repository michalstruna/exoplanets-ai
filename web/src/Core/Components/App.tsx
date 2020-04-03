import React from 'react'
import ReactDOM from 'react-dom'

import GlobalStyle from './GlobalStyle'
import Nav from './Nav'
import { useElement } from '../../Utils'
import Header from './Header'

interface Static {

}

interface Props {

}

const App: React.FC<Props> & Static = ({ children, ...props }) => {

    const { nav } = useElement()

    return (
        <>
            <GlobalStyle />
            {ReactDOM.createPortal((
                <Header
                    left={(
                        <>
                            <Nav />
                        </>
                    )}
                    right={(
                        <>

                        </>
                    )} />
            ), nav.current)}
            {children}
        </>
    )
}

export default App