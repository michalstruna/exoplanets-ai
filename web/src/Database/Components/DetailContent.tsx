import React from 'react'
import Styled from 'styled-components'
import { Color } from '../../Style'

type ItemData = {
    name: string
    text: string
    children?: ItemData[]
}

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    sections: ItemData[]
    title?: string
}

const Root = Styled.div`
    background-color: ${Color.BACKGROUND};
    flex: 0 0 15rem;
    left: 0;
    position: sticky;
`

const Nav = Styled.nav`
    position: sticky;
    top: 0;

    & > div {
        margin-left: 0;
    }
`

const Level = Styled.div`
    margin-left: 2rem;
`

const Item = Styled.div`
    line-height: 2rem;
`

const ItemButton = Styled.button`
    box-sizing: border-box;
    padding: 0 0.5rem;
`

const Title = Styled.h4`
    background-color: ${Color.MEDIUM_DARK};
    font-weight: bold;
    padding: 1rem 0.5rem;
`

const DetailContent = ({ title, sections, ...props }: Props) => {

    const memoSections = React.useMemo(() => {
        const renderLevel = (level: ItemData[]) => (
            <Level>
                {level.map((section, i) => (
                    <Item key={i}>
                        <ItemButton>
                            {section.text}
                        </ItemButton>
                        {section.children && renderLevel(section.children)}
                    </Item>
                ))}
            </Level>
        )

        return renderLevel(sections)
    }, [])

    return (
        <Root {...props}>
            <Nav>
                <Title>
                    {title}
                </Title>
                {memoSections}
            </Nav>
        </Root>
    )

}

export default DetailContent