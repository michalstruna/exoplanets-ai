import React from 'react'
import Styled, { css } from 'styled-components'
import { Color, Duration, ZIndex, zoomIn } from '../../Style'
import { useTooltip, setTooltip } from '..'
import { useActions } from '../../Data'
import { useEvent } from '../../Native'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    render: () => React.ReactNode
}

interface AreaProps extends React.ComponentPropsWithoutRef<'div'> {

}

interface AreaRootProps {
    isVisible: boolean
}

const Root = Styled.div`

`

const TransformationWrapper = Styled.div<AreaRootProps>`
    pointer-events: none;
    position: fixed;
`

const AreaRoot = Styled.div<AreaRootProps>`
    background-color: #444;
    box-shadow: 0 0 0.5rem ${Color.DARK};
    cursor: auto;
    overflow: hidden;
    position: relative;    
    transform: scale(0);
    transition: transform ${Duration.MEDIUM};
    z-index: ${ZIndex.TOOLTIP};
    
    ${props => props.isVisible && css`
        animation: ${zoomIn} ${Duration.MEDIUM} 1;
        pointer-events: all;
    `}
    
    & > * {
        user-select: auto;
    }
`

const Tooltip = ({ render, ...props }: Props) => {

    const id = React.useMemo(() => new Date().getTime() + Math.random().toString(), [])
    const actions = useActions({ setTooltip })

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation()
        props.onClick?.(event)

        if (!Tooltip.Area.instances[id]) {
            Tooltip.Area.instances[id] = { coords: { x: event.pageX, y: event.pageY }, render }
        } else {
            setTimeout(() => {
                Tooltip.Area.instances[id] = null
            }, 250)
        }

        actions.setTooltip(id)
    }

    return (
        <Root {...props} onClick={handleClick} />
    )

}

const TooltipArea = ({ ...props }: AreaProps) => {

    const actions = useActions({ setTooltip })
    const tooltip = useTooltip()

    const getPosition = (id: string) => {
        const instance = TooltipArea.instances[id]

        if (!instance) {
            return undefined
        }

        const withXShift = instance.coords.x > window.innerWidth - 400 // TODO: Calculate width.
        const withYShift = instance.coords.y > window.innerHeight - 250 // TODO: Calculate height.

        const transform = []
        transform.push(withXShift ? 'translateX(-100%) translateX(-0.5rem)' : 'translateX(0.5rem)')
        withYShift && transform.push('translateY(-100%)')

        return {
            transform: transform.join(' '),
            left: instance.coords.x + 'px',
            top: instance.coords.y + 'px'
        }
    }

    const getScale = (id: string) => {
        const isActive = id === tooltip
        const instance = TooltipArea.instances[id]

        if (!instance) {
            return undefined
        }

        const withXShift = instance.coords.x > window.innerWidth - 400 // TODO: Calculate width.
        const withYShift = instance.coords.y > window.innerHeight - 250 // TODO: Calculate height.

        return {
            transform: `scale(${+isActive})`,
            transformOrigin: [withXShift ? 'right' : 'left', withYShift ? 'bottom' : 'top'].join(' ')
        }
    }

    const instance = TooltipArea.instances[tooltip]

    useEvent(window, 'click', () => {
        actions.setTooltip('')
    }, { active: !!instance })

    return (
        <>
            {Object.entries(TooltipArea.instances).map(([id, instance], i: number) => instance && (
                <TransformationWrapper
                    key={i}
                    style={getPosition(id)}
                    isVisible={id === tooltip.toString()}>
                    <AreaRoot
                        {...props}
                        key={i}
                        style={getScale(id)}
                        isVisible={id === tooltip.toString()}
                        onClick={e => e.stopPropagation()}>
                        {instance.render()}
                    </AreaRoot>
                </TransformationWrapper>
            ))}
        </>
    )

}

TooltipArea.instances = {} as Record<string, any>

Tooltip.Area = TooltipArea

export default Tooltip