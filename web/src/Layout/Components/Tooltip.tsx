import React from 'react'
import Styled from 'styled-components'
import { Color, Duration, ZIndex } from '../../Style'
import { useTooltip, setTooltip, TooltipData } from '..'
import { useActions } from '../../Data'
import { useEvent } from '../../Native'

interface Static {
    Area: any
}

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

interface AreaStatic {
    instances: Record<number, TooltipData>
}

interface AreaProps extends React.ComponentPropsWithoutRef<'div'> {

}

interface AreaRootProps {
    isVisible: boolean
}

const Root = Styled.div`

`

const AreaRoot = Styled.div<AreaRootProps>`
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
    
    & > * {
        user-select: auto;
    }
`

const Tooltip: React.FC<Props> & Static = ({ ...props }) => {

    return (
        <Root {...props}>

        </Root>
    )

}

const TooltipArea: React.FC<AreaProps> & AreaStatic = ({ ...props }) => {

    const [style, setStyle] = React.useState<Partial<CSSStyleDeclaration>>()
    const [isVisible, setVisible] = React.useState(false)
    const actions = useActions({ setTooltip })
    const tooltip = useTooltip()

    /*const updateCoords = (event: React.MouseEvent) => {
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
    }*/

    const instance = TooltipArea.instances[tooltip]

    useEvent(window, 'click', () => {
        actions.setTooltip(0)
    }, { active: !!instance })

    if (!instance) {
        return null
    }

    return (
        <AreaRoot
            {...props}
            isVisible={true}
            onClick={e => e.stopPropagation()}
            style={{ left: instance.coords.x + 'px', top: instance.coords.y + 'px'}}>
            {instance.render()}
        </AreaRoot>
    )

}

TooltipArea.instances = {}

Tooltip.Area = TooltipArea

export default Tooltip