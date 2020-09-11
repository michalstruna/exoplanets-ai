import React from 'react'
import Styled from 'styled-components'
import { Color, size } from '../../Style'
import { Arrays } from '../../Native'

type Item = {
    name: string
    distance: number
    size?: number
}

type LifeZone = {
    from: number
    to: number
}

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    systems: Item[][]
    lifeZones?: LifeZone[]
}

const Root = Styled.div`

`

const Orbit = Styled.div`
    border-radius: 100%;
    left: 50%;
    pointer-events: none;
    position: absolute;
    user-select: none;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
`

const System = Styled.div`
    ${size('100%', '15rem')}
    overflow: hidden;
    margin-bottom: 2rem;
    position: relative;
`

const InnerSystem = Styled.div`
    ${size('100%')}
    position: relative;
    transform: translateX(-50%);
`

const BodyName = Styled.p`
    font-size: 90%;
    left: calc(100% + 0.5rem);
    position: absolute;
    text-shadow: 0 0 0.4rem black;
    top: 50%;
    white-space: nowrap;
`

interface LifeZoneProps {
    thickness: number
    radius: number
}

const LifeZone = Styled(Orbit)<LifeZoneProps>`  
    ${props => size(props.radius + 'px')}
    background-image: radial-gradient(farthest-side, transparent calc(100% - ${props => props.thickness / 2}px), green, transparent 100%);
    opacity: 0.5;
    z-index: 0;
`

const getMinDistance = (systems: Item[][]) => {
    const distances = systems.map(system => system.map(body => body.distance)).reduce((prev, curr) => [...prev, ...curr], [])
    return Arrays.getNthExtreme(distances, Math.min, 3)
}

const getMaxDistance = (systems: Item[][]) => {
    return Arrays.getNthExtreme(systems[1].map(system => system.distance), Math.max, 2)
}

const DistanceVisualization = ({ systems, lifeZones, ...props }: Props) => {

    const memo = React.useMemo(() => {
        const minDistance = getMinDistance(systems)
        const maxDistance = getMaxDistance(systems)
        const ratio = Math.min(50 / minDistance, window.screen.width * 0.67 / maxDistance)

        return systems.map((system, i) => (
            <System key={i}>
                <InnerSystem>
                    {lifeZones && lifeZones[i] && (
                        <LifeZone
                            thickness={Math.round(ratio * (lifeZones[i].to - lifeZones[i].from))}
                            radius={Math.round(ratio * lifeZones[i].to)} />
                    )}
                    {system.map((body, j) => {
                        const distance = (body.distance || body.size!) * ratio

                        return (
                            <Orbit style={{
                                backgroundColor: body.distance ? undefined : 'yellow',
                                border: body.distance ? `1px solid ${Color.LIGHTEST}` : undefined,
                                height: distance,
                                width: distance
                            }} key={j}>
                                <BodyName
                                    style={{ transform: `translateY(-50%) translateY(${j - 1}rem)` }}>
                                    {body.name}
                                </BodyName>
                            </Orbit>
                        )
                    })}
                </InnerSystem>
            </System>
        ))
    }, [systems])

    return (
        <Root {...props}>
            {memo}
        </Root>
    )

}

export default DistanceVisualization