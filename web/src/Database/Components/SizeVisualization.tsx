import React from 'react'
import Styled from 'styled-components'
import { Color, size } from '../../Style'
import { Arrays } from '../../Native'

type Item = {
    name: string
    size: number
    image?: string
}

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    systems: Item[][]
}

const Root = Styled.div`
    position: relative;
`

const Body = Styled.img`
    left: 50%;
    pointer-events: none;
    position: relative;
    user-select: none;
    transform: translateX(-50%);
`

const OuterBody = Styled.div`
    margin-right: 2rem;
    position: relative;
    max-width: 20rem;
    
    &:first-of-type {
        max-width: 10rem;
        
        ${Body} {
            float: right;
            left: auto;
            transform: none;
        }
    }
`

interface BodyNameProps {
    small?: boolean
}

const BodyName = Styled.p<BodyNameProps>`
    font-size: 90%;
    left: 50%;
    margin-top: 1rem;
    position: absolute;
    text-align: center;
    text-shadow: 0 0 0.4rem black;
    top: 100%;
    transform: translateX(-50%);
    white-space: nowrap;
    min-width: 100%;
    
    ${props => props.small && `
        transform: rotate(-30deg) translateX(-50%) translateY(-100%);
    `}
`

const System = Styled.div`
    ${size('100%', '15rem')}
    align-items: center;
    display: flex;
    margin-bottom: 1rem;
    overflow: hidden;
    padding-bottom: 2rem;
`

const GridLine = Styled.div`
    ${size('1px', '100%')}
    color: ${Color.MEDIUM_LIGHT};
    font-size: 70%;
    position: absolute;
    text-indent: 0.5rem;
    top: 0;
    white-space: nowrap;
    
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

const get2ndMaxSize = (systems: Item[][]) => {
    const sizes = systems.map(system => system.map(body => body.size)).reduce((prev, curr) => [...prev, ...curr], [])
    return Arrays.getNthExtreme(sizes, Math.max, 3)
}

const SizeVisualization = ({ systems, ...props }: Props) => {

    const minSize = get2ndMaxSize(systems)
    const ratio = 200 / minSize
    const step = 40000
    const count = Math.ceil(window.screen.width / (step * ratio))

    return (
        <Root {...props}>
            {new Array(count).fill(null).map((_, i) => (
                <GridLine style={{ left: ratio * step * i }} key={i}>
                    {i === Math.floor(count / 2) ? '40k km' : ''}
                </GridLine>
            ))}
            {systems.map((system, i) => (
                <System key={i}>
                    {system.map((body, j) => {
                        const size = body.size * ratio

                        return (
                            <OuterBody key={j} style={{ width: size }}>
                                <Body src={body.image} height={size} />
                                {(i > 0 || j > 0) && <BodyName small={size < body.name.length * 8}>
                                    {body.name}
                                </BodyName>}
                            </OuterBody>
                        )
                    })}
                </System>
            ))}
        </Root>
    )

}

export default SizeVisualization