import React from 'react'
import Styled from 'styled-components'

import DetailContent from '../Components/DetailContent'
import { MinorSectionTitle, PageTitle, SectionTitle } from '../../Layout'

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

const Root = Styled.div`
    display: flex;
`

const Main = Styled.main`
    box-sizing: border-box;
    flex: 1 1 0;
    padding: 1rem;
`

const Title = Styled(PageTitle)`
    
`

const Subtitle = Styled(SectionTitle)`

`

const Subsubtitle = Styled(MinorSectionTitle)`

`

const SystemView = ({ ...props }: Props) => {

    return (
        <Root {...props}>
            <DetailContent sections={[
                { name: 'xx', text: 'Souhrn' },
                { name: '', text: 'Hvězda' },
                {
                    name: '', text: 'Planety', children: [
                        { name: '', text: 'Kepler-10a' },
                        { name: '', text: 'Kepler-10b' },
                        { name: '', text: 'Kepler-10c' }
                    ]
                },
                {
                    name: '', text: 'Vizualizace', children: [
                        { name: '', text: 'Velikosti' },
                        { name: '', text: 'Vzdálenosti' },
                        { name: '', text: 'Interaktivní model' }
                    ]
                },
                { name: '', text: 'Aktivita' }
            ]} />
            <Main>
                <Title>
                    Kepler-10
                </Title>
                <Subtitle>
                    Hvězda
                </Subtitle>
                <Subtitle>
                    Planety
                </Subtitle>
                <Subsubtitle>
                    Kepler-10a
                </Subsubtitle>
                <Subsubtitle>
                    Kepler-10b
                </Subsubtitle>
                <Subsubtitle>
                    Kepler-10c
                </Subsubtitle>
                <Subtitle>
                    Vizualizace
                </Subtitle>
                <Subtitle>
                    Aktivity
                </Subtitle>
                <div style={{ width: '1px', height: '1000px' }} />
                <div style={{ width: '1px', height: '1000px' }} />
                <div style={{ width: '1px', height: '1000px' }} />
                <div style={{ width: '1px', height: '1000px' }} />
                <div style={{ width: '1px', height: '1000px' }} />
            </Main>
        </Root>
    )

}

export default SystemView