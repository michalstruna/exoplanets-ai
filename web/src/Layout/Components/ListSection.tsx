import React from 'react'
import Styled from 'styled-components'
import { Color } from '../../Style'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    items?: React.ReactNode[]
}

const Root = Styled.div`

`

const Empty = Styled.p`
    color: ${Color.MEDIUM_LIGHT};
    font-style: italic;
`

const ListSection = ({ items, ...props }: Props) => {

    return (
        <Root {...props}>
            {items && items.length > 0 ? (
                items
            ) : (
                <Empty>
                    Žádná data.
                </Empty>
            )}
        </Root>
    )

}

export default ListSection