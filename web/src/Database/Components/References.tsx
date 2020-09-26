import React from 'react'
import Styled from 'styled-components'
import { Dataset, RefItem, StarData } from '../types'
import useRouter from 'use-react-router'
import { Color } from '../../Style'

interface Props extends React.ComponentPropsWithoutRef<'ol'> {
    items: Dataset[]
}

const Root = Styled.ol`
    column-count: 2;
    column-gap: 2rem;
    font-size: 90%;
    margin: 0;
    padding-left: 1rem;
    
    li {
        break-inside: avoid;
        page-break-inside: avoid;
        padding: 0.25rem 0.5rem;
    
        &[data-active] {
            background-color: ${Color.DARK_YELLOW};
        }
    }
`

const References = ({ items, ...props }: Props) => {

    const { location } = useRouter()
    const refId = location.hash && /^#ref[0-9]+$/.test(location.hash) ? parseInt(location.hash.replace('#ref', '')) : null

    return (
        <Root {...props}>
            {items.map((item, i) => (
                <li key={i} data-active={refId === i + 1 || undefined} id={`ref${i + 1}`}>
                    NASA. (2019). Kepler mission. [Data file]. Retrieved from
                    https://exoplanetarchive.ipac.caltech.edu.
                </li>
            ))}
        </Root>
    )

}

export default References