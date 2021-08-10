import React from 'react'
import Styled from 'styled-components'
import Url from 'url'
import useRouter from 'use-react-router'

import { Dataset } from '../types'
import { Color } from '../../Style'
import { Link } from '../../Routing'

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

const RefLink = Styled(Link)`
    font-size: 90%;
    
    &:not(:hover):not(:active) {
        border-bottom: 1px solid ${Color.LIGHTEST};
    }
`

const References = ({ items, ...props }: Props) => {

    const { location } = useRouter()
    const refId = location.hash && /^#ref[0-9]+$/.test(location.hash) ? parseInt(location.hash.replace('#ref', '')) : null

    return (
        <Root {...props}>
            {items.map((item, i) => {
                const dataUrl = Url.parse(item.items_getter || item.item_getter || '')
                const url = dataUrl.protocol + '//' + dataUrl.host

                return (
                    <li key={i} data-active={refId === i + 1 || undefined} id={`ref${i + 1}`}>
                        NASA. (2021). {item.name}. [{item.type} dataset]. Retrieved from <RefLink pathname={url}>{url}</RefLink>.
                    </li>
                )
            })}
        </Root>
    )

}

export default References