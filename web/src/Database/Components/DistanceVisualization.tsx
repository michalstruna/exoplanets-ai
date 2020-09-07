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

const LifeZone = Styled(Orbit)`
    border: 1px solid ${Color.GREEN};
    opacity: 0.3;
    z-index: 0;
`

const getMinDistance = (systems: Item[][]) => {
    const distances = systems.map(system => system.map(body => body.distance)).reduce((prev, curr) => [...prev, ...curr], [])
    return Arrays.getNthExtreme(distances, Math.min, 3)
}

const DistanceVisualization = ({ systems, lifeZones, ...props }: Props) => {

    const memo = React.useMemo(() => {
        const minDistance = getMinDistance(systems)
        const ratio = 50 / minDistance

        return systems.map((system, i) => (
            <System>
                <InnerSystem>
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
                                        style={{ transform: `translateY(-50%) translateY(${j}rem)` }}>
                                        {body.name}
                                    </BodyName>
                                </Orbit>
                        )
                    })}
                    {lifeZones && lifeZones[i] && (
                        <LifeZone style={{
                            width: ratio * lifeZones[i].from,
                            height: ratio * lifeZones[i].from,
                            borderWidth: ratio * (lifeZones[i].to - lifeZones[i].from)
                        }} />
                    )}
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