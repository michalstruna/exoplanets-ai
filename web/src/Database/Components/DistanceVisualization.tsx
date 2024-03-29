import React from 'react'
import Styled from 'styled-components'
import { Color, size } from '../../Style'
import { Arrays, Numbers } from '../../Native'
import { useStrings } from '../../Data'

type Item = {
    name: string
    distance: number
    size?: number
}

type LifeZone = {
    from: number
    to: number
}

interface LegendItemProps {
    color: string
    thickness: string
}

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    systems: Item[][]
    lifeZones?: LifeZone[]
}

const Root = Styled.div`
    position: relative;
`

const GridLine = Styled.div`
    ${size('1px', '100%')}
    color: ${Color.MEDIUM_LIGHT};
    font-size: 90%;
    position: absolute;
    text-indent: 0.5rem;
    top: 0;
    white-space: nowrap;
    z-index: 1;
    
    &:after {
        ${size('1px', '100%')}
        background-color: ${Color.LIGHTEST};
        content: "";
        display: inline-block;
        left: 0;
        opacity: 0.15;
        position: absolute;
        top: 0;
    }
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

const Legend = Styled.div`
    background-color: rgba(0, 0, 0, 0.2);
    font-size: 90%;
    line-height: 1.5rem;
    padding: 0.5rem;
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
`

const LegendTitle = Styled.div`
    font-weight: bold;
`

const LegendItem = Styled.div<LegendItemProps>`
    &:before {
        ${props => size('1.5rem', props.thickness)}
        background-color: ${props => props.color};
        content: "";
        display: inline-block;
        margin-right: 0.5rem;
        vertical-align: middle;
    }
`

interface LifeZoneProps {
    thickness: number
    radius: number
}

const LifeZoneArea = Styled(Orbit)<LifeZoneProps>`  
    ${props => size(props.radius + 'px')}
    background-image: radial-gradient(farthest-side, transparent calc(100% - ${props => (props.thickness / 2) || 50}px), green, transparent 100%);
    opacity: 0.5;
    z-index: 0;
`

const getMinDistance = (systems: Item[][]) => {
    const distances = systems.map(system => system.map(body => body.distance)).reduce((prev, curr) => [...prev, ...curr], [])
    return Arrays.getNthExtreme(distances, Math.min, 3)
}

const getMaxDistance = (systems: Item[][]) => {
    return Math.max(systems[0][1].distance, Arrays.getNthExtreme((systems[1].length > 1 ? systems[1] : systems[0]).map(system => system.distance), Math.max, 1))
}

const DistanceVisualization = ({ systems, lifeZones, ...props }: Props) => {

    const strings = useStrings().stars

    const minDistance = getMinDistance(systems)
    const maxDistance = getMaxDistance(systems)

    const minRatio = (window.screen.width - 240) * 0.05 / minDistance
    const maxRatio = (window.screen.width - 240 - 200) / maxDistance
    const ratio = Math.min(minRatio, maxRatio)
    const step = minRatio > maxRatio ? maxDistance / 10 : minDistance * 2

    return (
        <Root {...props}>
            {new Array(15).fill(null).map((_, i) => (
                <GridLine style={{ left: ratio * step * i }} key={i}>
                    {Numbers.format(step * i / 0.5) + ' au'}
                </GridLine>
            ))}
            <Legend>
                <LegendTitle>
                    {strings.legend}
                </LegendTitle>
                <LegendItem color={Color.LIGHTEST} thickness={'1px'}>
                    {strings.orbit}
                </LegendItem>
                <LegendItem color={Color.GREEN} thickness='0.9rem'>
                    {strings.lifeZone}
                </LegendItem>
                <LegendItem color={Color.MEDIUM} thickness='1px'>
                    {strings.distance}
                </LegendItem>
            </Legend>
            {systems.map((system, i) => (
                <System key={i}>
                    <InnerSystem>
                        {lifeZones && lifeZones[i] && (
                            <LifeZoneArea
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
            ))}
        </Root>
    )

}

export default DistanceVisualization