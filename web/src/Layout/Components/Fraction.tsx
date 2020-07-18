import React from 'react'
import Styled from 'styled-components'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    top: React.ReactNode
    bottom: React.ReactNode
}

const Root = Styled.div`
    display: inline-block;
    font-size: 70%;
    vertical-align: middle;
    
    hr {
        margin: 0.1rem 0;
    }
`

const Fraction = ({ top, bottom, ...props }: Props) => {

    return (
        <Root {...props}>
            <sup>{top}</sup>/<sub>{bottom}</sub>
        </Root>
    )

    return (
        <Root {...props}>
            <div>
                {top}
            </div>
            <hr />
            <div>
                {bottom}
            </div>
        </Root>
    )

}

export default Fraction