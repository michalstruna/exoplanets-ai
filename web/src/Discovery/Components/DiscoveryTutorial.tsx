import React from 'react'
import Styled from 'styled-components'
import { Color, image, size } from '../../Style'
import { useStrings } from '../../Data'
import { Link } from '../../Routing'
import { PageTitle, SectionTitle } from '../../Layout'

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

const Root = Styled.div`
    background-color: ${Color.MEDIUM_DARK};
    padding: 2rem 0;
    width: 100%;
`

const Inner = Styled.div`
    margin: 0 auto;
    width: 75rem;
    max-width: calc(100% - 2rem);
`

const Steps = Styled.main`
    align-items: center;
    display: flex;
    flex: 1 0 3rem;
`

const Block = Styled(Link)`
    ${image(undefined, '100% auto', 'top center')}
    box-sizing: border-box;
    flex: 1 0 15rem;
    padding-top: 10rem;
`

const Transition = Styled.div`
    ${image('Controls/ArrowRight.svg')}
    ${size('4rem', '5rem')}
    opacity: 0.2;
    transform: scaleX(0.5);
`

const Title = Styled(PageTitle)`
    font-size: 140%;
    margin-bottom: 2rem;
`

// TODO
const DOWNLOAD_URL = 'https://www.google.com'

const DiscoveryTutorial = ({ ...props }: Props) => {

    const strings = useStrings().discovery.tutorial

    const renderSteps = () => (
        strings.steps.map((step: any, i: number) => (
            <React.Fragment key={i}>
                <Block style={{ backgroundImage: `url(/img/Discovery/Tutorial/${step.icon})` }} pathname={step.download && DOWNLOAD_URL}>
                    <SectionTitle>
                        {step.title}
                    </SectionTitle>
                </Block>
                {i < strings.steps.length - 1 && <Transition />}
            </React.Fragment>
        ))
    )

    return (
        <Root {...props}>
            <Inner>
                <Title>
                    {strings.title}
                </Title>
                <Steps>
                    {renderSteps()}
                </Steps>
            </Inner>
        </Root>
    )

}

export default DiscoveryTutorial