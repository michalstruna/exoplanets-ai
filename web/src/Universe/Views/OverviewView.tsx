import React from 'react'
import Styled from 'styled-components'

import { Color, Dimensions, Mixin } from '../../Utils'
import { TopLevelStats } from '../../Stats'

interface Static {

}

interface Props {

}

const Root = Styled.div`
    ${Mixin.Size('100%', `calc(100vh - ${Dimensions.NAV_HEIGHT})`)}
    background-color: ${Color.BACKGROUND};
    display: flex;
`

const Left = Styled.div`
    ${Mixin.Size('40rem', '100%')}
    background-color: ${Color.MEDIUM_DARK};
`

const Center = Styled.div`
    ${Mixin.Size('calc((100vw - 40rem) * 0.4)', '100%')}
    margin: 0 1.5rem;
`

const Right = Styled.div`
    ${Mixin.Size('calc((100vw - 40rem) * 0.6)', '100%')}
    margin-right: 1rem;
`

const Users = Styled.div`
    ${Mixin.Size('100%', `30rem`)}
    background-color: ${Color.MEDIUM_DARK};
`

const Todo1 = Styled.div`
    ${Mixin.Size('100%', `calc(100% - 33rem)`)}
    background-color: ${Color.MEDIUM_DARK};
    margin-top: 1.5rem;
`

const Todo2 = Styled.div`
    ${Mixin.Size('100%', `calc(100% - 33rem)`)}
    background-color: ${Color.MEDIUM_DARK};
`

const News = Styled.div`
    ${Mixin.Size('100%', '30rem')}
    background-color: ${Color.MEDIUM_DARK};
    margin-top: 1.5rem;
`

const OverviewView: React.FC<Props> & Static = ({ ...props }) => {

    return (
        <Root {...props}>
            <Left>
                <TopLevelStats data={{ discoveredPlanets: 16, exploredStars: 2793, computingTime: 5235.231465, volunteers: 123 }} />
                Objevených planet celkem | transit | radial velocity
                <br />
                Z toho potenciálně obyvatelných
                Zkontrolovaných hvězd
                Tabulka spektrálních tříd a objeveých exoplanet
            </Left>
            <Center>
                <Users>
                    &lt; Stránka &gt; Časový interval
                    Pořadí. Ikona username ... score přírustek
                    Vpravo: Objevených planet, Prozkoumaných hvězd, Výpočetní čas, ???
                </Users>
                <Todo1>
                    Záložky:
                    - Chat + online uživatelé,
                    - Historie (objevené planety, zpracované hvězdy) - za posledních 100 dnů
                    - Hw info
                </Todo1>
            </Center>
            <Right>
                <Todo2 />
                <News />
            </Right>
        </Root>
    )

}

export default OverviewView