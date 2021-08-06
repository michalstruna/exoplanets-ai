import React from 'react'
import Styled from 'styled-components'
import { image, size } from '../../Style'
import { PlanetData, StarData } from '../types'
import { useStrings } from '../../Data'
import SpectralClass from '../Constants/SpectralClass'
import { Value } from '..'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    body: StarData | PlanetData
    withImage?: boolean
}

const Root = Styled.div`
    text-align: center;
`

const Image = Styled.div`
    ${image(undefined, '110% auto')}
    ${size('16rem')}
    background-image: url('https://www.solarsystemscope.com/spacepedia/images/handbook/renders/sun.png');
    border-radius: 100%;
    margin-bottom: 1rem;
`

const SpectralType = Styled.div`
    display: inline-block;
    font-weight: bold;
    font-style: normal;
`

const spectralClassColor: Record<string, string> = { default: '#999', [SpectralClass.A]: '#DFF', [SpectralClass.B]: '#3FF', [SpectralClass.F]: '#EE0', [SpectralClass.G]: '#CC0', [SpectralClass.K]: '#F80', [SpectralClass.M]: '#F50', [SpectralClass.O]: '#0FF' }


const BodyType = ({ body, withImage, ...props }: Props) => {

    const strings = useStrings()

    if ('light_curves' in body) {
        if (!body.properties || !body.properties[0]) {
            return (
                <div style={{ color: spectralClassColor.default }}>
                    {withImage && <Image />}
                    {strings.stars.unknownType + ' ' + strings.stars.unknownSize.toLowerCase()}
                </div>
            )
        }

        const type = Value.Star.prop(body, 'type') || {}

        return (
            <Root style={{ color: spectralClassColor[type.spectral_class || 'default'] }}>
                {withImage && <Image />}
                {(strings.stars.colors[type.spectral_class!] || strings.stars.unknownType) + ' '}
                {(strings.stars.sizes[type.luminosity_class!] || strings.stars.unknownSize).toLowerCase() + ' '}
                <SpectralType>
                    {type.spectral_class}
                    {type.spectral_subclass}
                    {type.luminosity_class}
                </SpectralType>
            </Root>
        )
    } else {
        const type = body.properties[0].type

        return (
            <Root>
                {withImage && <Image style={{ backgroundImage: `url(https://www.pngkey.com/png/full/178-1788085_wip-new-planet-textures-space-pendant-gas-giant.png)` }} />}
                {strings.planets.types[type] || strings.planets.unknownType}
            </Root>
        )
    }

}

export default BodyType