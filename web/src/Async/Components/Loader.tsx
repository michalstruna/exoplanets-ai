import React from 'react'
import Styled from 'styled-components'

import { Mixins, Keyframes, Duration } from '../../Style'

export interface Static {

}

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

export type Type = React.FC<Props> & Static

const Root = Styled.div`
    ${Mixins.FlexCenter()}
    ${Mixins.Size('100%')}
    animation: ${Keyframes.FadeIn} ${Duration.SLOW};
    left: 0;
    position: absolute;
    top: 0;
`

const Inner = Styled.div`
    ${Mixins.Image('Async/Loader.svg')}
    ${Mixins.Size('4rem')}
`

const Loader: Type = ({ ...props }) => (
    <Root {...props}>
        <Inner />
    </Root>
)


export default Loader