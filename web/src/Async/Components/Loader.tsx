import React from 'react'
import Styled from 'styled-components'

import { Mixin, Keyframe, Duration } from '../../Utils'

export interface Static {

}

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

export type Type = React.FC<Props> & Static

const Root = Styled.div`
    ${Mixin.FlexCenter()}
    ${Mixin.Size('100%')}
    animation: ${Keyframe.FadeIn} ${Duration.SLOW};
    left: 0;
    position: absolute;
    top: 0;
`

const Inner = Styled.div`
    ${Mixin.Image('Async/Loader.svg')}
    ${Mixin.Size('4rem')}
`

const Loader: Type = ({ ...props }) => (
    <Root {...props}>
        <Inner />
    </Root>
)


export default Loader