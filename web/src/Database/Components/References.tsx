import React from 'react'
import Styled from 'styled-components'
import { Dataset, RefItem, StarData } from '../types'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    items: Dataset[]
}

const Root = Styled.div`
    
`

const References = ({ items, ...props }: Props) => {

    return (
        <Root {...props}>
            <ol>
                {items.map((item, i) => (
                    <li key={i}>
                        NASA. (2019). Kepler mission. [Data file]. Retrieved from
                        https://exoplanetarchive.ipac.caltech.edu.
                    </li>
                ))}
            </ol>
        </Root>
    )

}

export default References