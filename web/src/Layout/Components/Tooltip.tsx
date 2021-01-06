import React, { CSSProperties, useReducer } from 'react'
import Styled, { css } from 'styled-components'

import { Color, Duration, ZIndex, zoomIn } from '../../Style'
import { useTooltip, setTooltip } from '..'
import { useActions } from '../../Data'
import { useElement, useEvent } from '../../Native'

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
    position: absolute;
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

    React.useEffect(() => {
        if (Tooltip.Area.instances[id]) {
            Tooltip.Area.instances[id].render = render
            Tooltip.Area.update?.()
        }
    }, [render])

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
    const { app } = useElement()
    TooltipArea.update = useReducer(x => x + 1, 0)[1]

    React.useEffect(() => {

    })

    const getAndSetCoords = (id: string) => {
        const instance = TooltipArea.instances[id]

        if (instance.coords) {
            const tmp = instance.coords
            instance.coords = null
            return tmp
        } else {
            instance.coords = instance.setCoords(instance.event)
            return instance.coords
        }
    }

    const getPosition = (id: string, windowSize: [number, number]): [CSSProperties?, CSSProperties?, CSSProperties?] => {
        const instance = TooltipArea.instances[id]
        const coords = getAndSetCoords(id)
        const isActive = id === tooltip

        const withXShift = coords.x > windowSize[0] * 0.5 // TODO: Calculate width.
        const withYShift = coords.y > windowSize[1] * 0.5 // TODO: Calculate height.

        const transform = []
        transform.push(withXShift ? 'translateX(-100%) translateX(2rem)' : 'translateX(-2rem)')
        transform.push(withYShift ? 'translateY(-100%) translateY(-1.5rem)' : 'translateY(1.5rem)')

        return [
            {
                transform: transform.join(' '),
                left: Math.max(MIN_EDGE, Math.min(windowSize[0] - MIN_EDGE + app.current.scrollLeft, coords.x)) + 'px',
                top: Math.max(MIN_EDGE, Math.min(windowSize[1] - MIN_EDGE + app.current.scrollTop, coords.y)) + 'px',
                position: instance.setCoords === Tooltip.defaultProps.setCoords ? 'absolute': 'fixed'
            },
            {
                [withYShift ? 'top' : 'bottom']: '100%',
                [withYShift ? 'borderTopColor' : 'borderBottomColor']: '#444',
                [withXShift ? 'right' : 'left']: '2rem'
            },
            {
                transform: `scale(${+isActive})`,
                transformOrigin: [withXShift ? 'right' : 'left', withYShift ? 'bottom' : 'top'].join(' ')
            }
        ]
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
                const [rootPos, arrowPos, scale] = getPosition(id, windowSize)

                return (
                    <TransformationWrapper
                        key={i}
                        style={rootPos}
                        isVisible={id === tooltip.toString()}>
                        <AreaRoot
                            {...props}
                            key={i}
                            style={scale}
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
TooltipArea.update = null as (() => void) | null

Tooltip.Area = TooltipArea
Tooltip.hide = () => setTooltip('')

Tooltip.defaultProps = {
    setCoords: (e: React.MouseEvent<HTMLDivElement>) => {
        const app = document.getElementById('app')!
        return { x: e.clientX + app.scrollLeft - app.offsetLeft, y: e.clientY + app.scrollTop - app.offsetTop }
    }
}

export default Tooltip