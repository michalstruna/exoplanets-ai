import React from 'react'
import Styled from 'styled-components'

import { flexCenter, size, image, fadeIn, Duration } from '../../Style'

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

const Root = Styled.div`
    ${flexCenter()}
    ${size('100%')}
    animation: ${fadeIn} ${Duration.SLOW};
    left: 0;
    position: absolute;
    top: 0;
`

const Inner = Styled.div`
    ${image('Async/Loader.svg')}
    ${size('4rem')}
`

const Loader = ({ ...props }: Props) => (
    <Root {...props}>
        <Inner />
    </Root>
)


export default Loader