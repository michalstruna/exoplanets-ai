import React from 'react'
import Styled from 'styled-components'

import { PlanetData, StarData } from '../types'
import { Target } from '../../Routing'
import { useStrings } from '../../Data'
import SpectralClass from '../Constants/SpectralClass'
import { image, size } from '../../Style'
import { Value } from '../index'
import { pascalCase } from 'change-case'

type PreviewData = {
    titleComponent?: React.FC<React.ComponentPropsWithoutRef<any>>
    subtitleComponent?: React.FC<React.ComponentPropsWithoutRef<any>>
}

interface Props extends Omit<React.ComponentPropsWithoutRef<'div'>, 'title'>, PreviewData {
    title?: React.ReactNode
    subtitle?: React.ReactNode
    image: string
    tags?: React.ReactNode
    size?: number
    link?: Target
    large?: boolean
}

interface SpecificProps<T> extends Omit<React.ComponentPropsWithoutRef<'div'>, 'title'>, PreviewData {
    item: T
    withLink?: boolean
    withImage?: boolean
}

const Root = Styled.div`
    align-items: center;
    display: flex;
    line-height: 1.3rem;
    overflow: hidden;
`

interface ItemImageProps {
    large?: boolean
    image: string
}

const Image = Styled.div<ItemImageProps>`
    ${props => size(props.large ? '4rem' : '2.5rem')}
    ${props => image(props.image)}
    display: inline-block;
    margin-right: 0.5rem;
`

const TitleContainer = Styled.div`
    & > h1, & > h2, & > h3, & > h4 {
        &:first-child {
            margin: 0;
            margin-bottom 0.25em;
            padding: 0;
        }
    }
`

const ItemPreview = ({ image, large, title, titleComponent: Title, subtitleComponent: Subtitle, subtitle, ...props }: Props) => {

    return (
        <Root {...props}>
            {image && <Image large={large} image={image} />}
            <TitleContainer>
                {Title && <Title>
                    {title}
                </Title>}
                {Subtitle && <Subtitle>
                    {subtitle}
                </Subtitle>}
            </TitleContainer>
        </Root>
    )

}

const DefaultTitle = Styled.div`font-weight: bold;`
const DefaultSubtitle = Styled.div`font-style: italic;`

ItemPreview.defaultProps = {
    titleComponent: DefaultTitle,
    subtitleComponent: DefaultSubtitle
}


const spectralClassColor: Record<string, string> = { default: '#999', [SpectralClass.A]: '#DFF', [SpectralClass.B]: '#3FF', [SpectralClass.F]: '#EE0', [SpectralClass.G]: '#CC0', [SpectralClass.K]: '#F80', [SpectralClass.M]: '#F50', [SpectralClass.O]: '#0FF' }

const SpectralType = Styled.div`
    display: inline-block;
    font-weight: bold;
    font-style: normal;
`

interface ColoredProps {
    color: string
}

const Colored = Styled.div<ColoredProps>`
    color: ${props => props.color};
    display: inline-block;
`

export const Star = ({ item, withLink, withImage, ...props }: SpecificProps<StarData>) => {

    const strings = useStrings().stars

    if (!item.properties[0]) {
        return (
            <ItemPreview
                {...props}
                title={item.light_curves[0]?.name}
                subtitle={(
                    <Colored color={spectralClassColor.default}>
                        {strings.unknownType + ' ' + strings.unknownSize.toLowerCase()}
                    </Colored>
                )}
                image='Database/Star/Unknown.svg' />
        )
    }

    const type = Value.Star.prop(item, 'type')

    return (
        <ItemPreview
            {...props}
            title={Value.Star.name(item)}
            subtitle={(
                <Colored color={spectralClassColor[type.spectral_class || 'default']}>
                    {(strings.colors[type.spectral_class] || strings.unknownType) + ' '}
                    {(strings.sizes[type.luminosity_class] || strings.unknownSize).toLowerCase() + ' '}
                    <SpectralType>
                        {type.spectral_class}
                        {type.spectral_subclass}
                        {type.luminosity_class}
                    </SpectralType>
                </Colored>
            )}
            image={`Database/Star/${type.spectral_class || 'Unknown'}.svg`}
            large={true} />
    )

}

export const Planet = ({ item, withLink, withImage, ...props }: SpecificProps<PlanetData>) => {

    const strings = useStrings().planets

    if (!item.properties[0]) {
        return (
            <ItemPreview
                {...props}
                title={'a'}
                subtitle={(
                    <Colored color={spectralClassColor.default}>
                        {strings.unknownType.toLowerCase()}
                    </Colored>
                )}
                image='Database/Star/Unknown.svg' />
        )
    }

    const type = Value.Star.prop(item as any, 'type')

    return (
        <ItemPreview
            {...props}
            title={Value.Star.name(item as any)}
            subtitle={strings.types[type] || strings.unknownType}
            image={`Database/Planet/${pascalCase(type || 'unknown')}.png`}
            large={false} />
    )

}