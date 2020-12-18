import React, { CSSProperties } from 'react'
import Styled, { css } from 'styled-components'
import { Color, Duration, ZIndex, zoomIn } from '../../Style'
import { useTooltip, setTooltip } from '..'
import { useActions } from '../../Data'
import { useEvent } from '../../Native'

interface Props extends Omit<React.ComponentPropsWithoutRef<'div'>, 'id'> {
    render: () => React.ReactNode
    setCoords?: (event: React.MouseEvent<HTMLDivElement>) => ({ x: number, y: number })
    id?: string
}

interface AreaProps extends React.ComponentPropsWithoutRef<'div'> {

}

interface AreaRootProps {
    isVisible: boolean
}

const Root = Styled.div`
    height: 100%;
`

const TransformationWrapper = Styled.div<AreaRootProps>`
    pointer-events: none;
    position: fixed;
    z-index: ${ZIndex.TOOLTIP};
`

const AreaRoot = Styled.div<AreaRootProps>`
    background-color: #444;
    box-shadow: 0 0 0.5rem ${Color.DARK};
    cursor: auto;
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

const Arrow = Styled.div`
    border: 0.5rem solid transparent;
    position: absolute;
    pointer-events: none;
    width: 0;
`

const Tooltip = ({ id: _id, setCoords, render, ...props }: Props) => {

    const id = React.useMemo(() => _id ?? new Date().getTime() + Math.random().toString(), [_id])
    const actions = useActions({ setTooltip })

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation()
        event.persist()
        props.onClick?.(event)

        if (!Tooltip.Area.instances[id]) {
            Tooltip.Area.instances[id] = { setCoords, event, render }
        } else {
            setTimeout(() => {
                //Tooltip.Area.instances[id] = null
            }, 250)
        }

        actions.setTooltip(id)
    }

    return (
        <Root {...props} onClick={handleClick} />
    )

}

const MIN_EDGE = 10

const TooltipArea = ({ ...props }: AreaProps) => {

    const actions = useActions({ setTooltip })
    const tooltip = useTooltip()

    const getPosition = (id: string, windowSize: [number, number]): [CSSProperties?, CSSProperties?] => {
        const instance = TooltipArea.instances[id]
        const coords = instance.setCoords(instance.event)

        if (!instance) {
            return [undefined, undefined]
        }

        const withXShift = coords.x > windowSize[0] - 400 // TODO: Calculate width.
        const withYShift = coords.y > windowSize[1] - 290 // TODO: Calculate height.

        const transform = []
        transform.push(withXShift ? 'translateX(-100%) translateX(2rem)' : 'translateX(-2rem)')
        transform.push(withYShift ? 'translateY(-100%) translateY(-1.5rem)' : 'translateY(1.5rem)')

        return [
            {
                transform: transform.join(' '),
                left: Math.max(MIN_EDGE, Math.min(windowSize[0] - MIN_EDGE, coords.x)) + 'px',
                top: Math.max(MIN_EDGE, Math.min(windowSize[1] - MIN_EDGE, coords.y)) + 'px'
            },
            {
                [withYShift ? 'top' : 'bottom']: '100%',
                [withYShift ? 'borderTopColor' : 'borderBottomColor']: '#444',
                [withXShift ? 'right' : 'left']: '2rem'
            }
        ]
    }

    const getScale = (id: string, windowSize: [number, number]) => {
        const isActive = id === tooltip
        const instance = TooltipArea.instances[id]
        const coords = instance.setCoords(instance.event)

        if (!instance) {
            return undefined
        }

        const withXShift = coords.x > windowSize[0] - 400 // TODO: Calculate width.
        const withYShift = coords.y > windowSize[1] - 290 // TODO: Calculate height.

        return {
            transform: `scale(${+isActive})`,
            transformOrigin: [withXShift ? 'right' : 'left', withYShift ? 'bottom' : 'top'].join(' ')
        }
    }

    const instance = TooltipArea.instances[tooltip]

    useEvent(window, 'click', () => {
        actions.setTooltip('')
    }, { active: !!instance })

    const [windowSize, setWindowSize] = React.useState<[number, number]>([window.innerWidth, window.innerHeight])
    useEvent(window, 'resize', () => setWindowSize([window.innerWidth, window.innerHeight]))

    return (
        <>
            {Object.entries(TooltipArea.instances).map(([id, instance], i: number) => {
                if (!instance) return null
                const [rootPos, arrowPos] = getPosition(id, windowSize)

                return (
                    <TransformationWrapper
                        key={i}
                        style={rootPos}
                        isVisible={id === tooltip.toString()}>
                        <AreaRoot
                            {...props}
                            key={i}
                            style={getScale(id, windowSize)}
                            isVisible={id === tooltip.toString()}
                            onClick={e => e.stopPropagation()}>
                            <Arrow style={arrowPos} />
                            {instance.render()}
                        </AreaRoot>
                    </TransformationWrapper>
                )
            })}
        </>
    )

}

TooltipArea.instances = {} as Record<string, any>

Tooltip.Area = TooltipArea

Tooltip.defaultProps = {
    setCoords: (e: React.MouseEvent<HTMLDivElement>) => ({ x: e.pageX, y: e.pageY })
}

export default Tooltip