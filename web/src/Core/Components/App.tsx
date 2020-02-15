import React from 'react'

interface Static {

}

interface Props {

}

const App: React.FC<Props> & Static = ({ children }) => {

    return (
        <>
            {children}
        </>
    )
}

export default App