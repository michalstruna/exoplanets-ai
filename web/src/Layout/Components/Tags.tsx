import React from 'react'
import Styled from 'styled-components'
import { Color } from '../../Style'

type TagData = {
    text: string
    color?: string
}

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    items: TagData[]
}

const Root = Styled.div`
    
`

const Tag = Styled.div`
    background-color: ${Color.MEDIUM};
    display: inline-block;
    font-size: 90%;
    font-weight: bold;
    margin-right: 0.5rem;
    padding: 0.25rem 0.5rem;
`

const Tags = ({ items, ...props }: Props) => {

    return (
        <Root {...props}>
            {items.map((item, i) => (
                <Tag style={item.color ? { backgroundColor: item.color } : undefined} key={i}>
                    {item.text}
                </Tag>
            ))}
        </Root>
    )

}

export default Tags