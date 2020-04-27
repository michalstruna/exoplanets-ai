import React from 'react'
import Styled from 'styled-components'
import { Color, Duration, ZIndex } from '../../Style'
import { useEvent } from '../../Native'

interface Static {

}

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    renderContent: () => React.ReactNode
}

interface ContentProps {
    isVisible: boolean
}

const Root = Styled.div`
    user-select: none;
`

const Content = Styled.div<ContentProps>`
    background-color: #444;
    box-shadow: 0 0 0.5rem ${Color.DARK};
    cursor: auto;
    overflow: hidden;
    user-select: all;
    position: fixed;
    transform: scale(0);
    transform-origin: left top;
    transition: transform ${Duration.MEDIUM};
    z-index: ${ZIndex.TOOLTIP};
    
    ${props => props.isVisible && `
        transform: scale(1);
    `}
`

const InnerContent = Styled.div`

`

let hideActive: (() => void) | undefined

const Tooltip: React.FC<Props> & Static = ({ renderContent, children, ...props }) => {


    const [style, setStyle] = React.useState<Partial<CSSStyleDeclaration>>()

    const updateCoords = (event: React.MouseEvent) => {
        event.nativeEvent.stopImmediatePropagation()

        if (hideActive) {
            hideActive()
            hideActive = undefined
        } else {
            const newStyle: Partial<CSSStyleDeclaration> = { left: event.pageX + 'px', top: event.pageY + 'px' }
            let transforms = []

            transforms.push(event.pageX > window.innerWidth - 300 ? 'translateX(-100%) translateX(-0.5rem)' : 'translateX(0.5rem)')

            if (event.pageY > window.innerHeight - 250) {
                transforms.push('translateY(-100%)')
            }

            //newStyle.transform = transforms.join(' ')
            setStyle(newStyle)
            hideActive = () => setStyle(undefined)
        }
    }

    useEvent(window, 'click', () => {
        hideActive?.()
        hideActive = undefined
    }, { active: !!style })

    return (
        <Root
            {...props}
            onClick={updateCoords}>
            {children}
            <Content isVisible={!!style} onClick={e => e.stopPropagation()} style={style as any}>
                {renderContent()}
            </Content>
        </Root>
    )

}

export default Tooltip