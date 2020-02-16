import React from 'react'
import Styled from 'styled-components'

import GlobalStyle from './GlobalStyle'
import Nav from './Nav'
import { Color, Dimensions, Mixin } from '../../Utils'
import Header from './Header'

interface Static {

}

interface Props {

}

const Root = Styled.div`
    ${Mixin.Size('100%', '100vh')}
`

const Content = Styled.div`
    background-color: ${Color.MEDIUM_DARK};
    height: calc(100% - ${Dimensions.NAV_HEIGHT});
    overflow-y: hidden;
    overflow-x: auto;
    position: relative;
`

const App: React.FC<Props> & Static = ({ children, ...props }) => {

    return (
        <Root {...props}>
            <GlobalStyle />
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
            <Content>
                {children}
            </Content>
        </Root>
    )
}

export default App