import React from 'react'
import Styled from 'styled-components'
import { Color, image, size } from '../../Style'
import { useStrings } from '../../Data'
import { Link } from '../../Routing'
import { PageTitle, SectionTitle } from '../../Layout'

interface Props extends React.ComponentPropsWithoutRef<'div'> {}

const Root = Styled.div`
    background-color: ${Color.MEDIUM_DARK};
    width: 100%;
`

const Inner = Styled.div`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin: 0 auto;
    padding: 1rem;
    width: 75rem;
    max-width: 100%;
`

const Steps = Styled.main`
    ${size()}
    align-items: center;
    display: flex;
    justify-content: space-around;
    flex: 1 0 3rem;
`

const Step = Styled(Link)`
    flex: 1 1 0;
    max-width: 15rem;
`

const Transition = Styled.div`
    ${image('Controls/ArrowRight.svg')}
    flex: 0 0 4rem;
    height: 5rem;
    opacity: 0.2;
    transform: scaleX(0.5);
`

const Title = Styled(PageTitle)`
    font-size: 140%;
    margin-bottom: 2rem;
`

const StepImage = Styled.div`
    ${image(undefined, '90% auto')}
    height: 0;
    padding-bottom: 60%;
`

const StepTitle = Styled(SectionTitle)`
    font-size: 120%;
    padding: 0;
`

const DiscoveryTutorial = ({ ...props }: Props) => {
    const strings = useStrings().discovery.tutorial

    const renderSteps = () =>
        strings.steps.map((step: any, i: number) => (
            <React.Fragment key={i}>
                <Step pathname={step.download}>
                    <StepImage style={{ backgroundImage: `url(/img/Discovery/Tutorial/${step.icon})` }} />
                    <StepTitle>{step.title}</StepTitle>
                </Step>
                {i < strings.steps.length - 1 && <Transition />}
            </React.Fragment>
        ))

    return (
        <Root {...props}>
            <Inner>
                <Title>{strings.title}</Title>
                <Steps>{renderSteps()}</Steps>
            </Inner>
        </Root>
    )
}

DiscoveryTutorial.Root = Root
DiscoveryTutorial.Inner = Inner

export default DiscoveryTutorial
