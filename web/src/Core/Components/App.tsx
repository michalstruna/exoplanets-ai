import React from 'react'

import GlobalStyle from './GlobalStyle'

interface Static {

}

interface Props {

}

const App: React.FC<Props> & Static = ({ children }) => {

    return (
        <>
            <GlobalStyle />
            {children}
        </>
    )
}

export default App