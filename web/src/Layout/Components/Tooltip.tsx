import React from 'react'
import Styled from 'styled-components'
import { Color, ZIndex } from '../../Style'

interface Static {

}

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    renderContent: () => React.ReactNode
}

const Root = Styled.div`

`

const Content = Styled.div`
    background-color: #444;
    box-shadow: 0 0 0.5rem ${Color.DARK};
    position: fixed;
    z-index: ${ZIndex.TOOLTIP};
`

const Tooltip: React.FC<Props> & Static = ({ renderContent, children, ...props }) => {

    const [style, setStyle] = React.useState<Partial<CSSStyleDeclaration>>()

    const updateCoords = (event: React.MouseEvent) => {
        const newStyle: Partial<CSSStyleDeclaration> = { left: event.pageX + 'px', top: event.pageY + 'px' }
        let transforms = []

        if (event.pageX > window.innerWidth - 300) {
            transforms.push('translateX(-100%)')
        }

        if (event.pageY > window.innerHeight - 250) {
            transforms.push('translateY(-100%)')
        }

        newStyle.transform = transforms.join(' ')
        setStyle(newStyle)
    }

    return (
        <Root
            {...props}
            onMouseEnter={updateCoords}
            onMouseLeave={() => setStyle(undefined)}>
            {children}
            {style && (
                <Content style={style as any}>
                    {renderContent()}
                </Content>
            )}
        </Root>
    )

}

export default Tooltip