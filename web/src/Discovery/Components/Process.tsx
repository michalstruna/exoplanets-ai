import React from 'react'
import Styled from 'styled-components'
import { Color } from '../../Style'
import { IconText, Log } from '../../Layout'

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

const Root = Styled.div`
    background-color: ${Color.MEDIUM_DARK};
    box-sizing: border-box;
    display: flex;
    margin: 1rem 0;
`

const Main = Styled.div`
    box-sizing: border-box;
    padding: 1rem;
    width: calc(100% - 10rem);
`

const Row = Styled.div`
    align-items: center;
    display: flex;
    padding-bottom: 0.5rem;
    width: 100%;
    
    & > * {
        flex: 1 1 0;
    }
    
    &:last-of-type {
        border-top: 1px solid #555;
        padding-top: 0.5rem;
        padding-bottom: 0;
    }
    
    button {
        text-align: left;
    }
`

const Name = Styled.div`
    font-size: 150%;
    font-weight: bold;
`

const DiscoveryLog = Styled(Log)`
    height: 14.5rem;
`

const Process = ({ ...props }: Props) => {

    const handleRun = () => {

    }

    const handlePause = () => {

    }

    const handleStop = () => {

    }

    return (
        <Root {...props}>
            <Main>
                <Row>
                    <Name>
                        Domov
                    </Name>
                    <IconText icon='User/Online.svg' text='Běží 51 m 13 s' />
                </Row>
                <Row>
                    <IconText icon='Discovery/Process/OS/Windows.svg' text='OS' value={'Windows 10'} />
                    <IconText icon='Discovery/Process/CPU/Intel.svg' text='CPU' value={'Intel Core i9'} />
                </Row>
                <Row>
                    <IconText icon='Discovery/Process/Processing.svg' text='% vašeho výkonu' value={50} />
                    <IconText icon='Discovery/Process/Processing.svg' text='% celkového výkonu' value={0.051} />
                </Row>
                <Row>
                    <IconText icon='Discovery/Process/Star.svg' text={'Analyzovaných hvězd'} value={1363} />
                    <IconText icon='Discovery/Process/Planet.svg' text={'Objevených planet'} value={1} />
                </Row>
                <Row>
                    <IconText icon='Controls/PlayGreen.svg' text={'Spustit'} onClick={handleRun} />
                    <IconText icon='Controls/Stop.svg' text={'Ukončit'} onClick={handleStop} />
                </Row>
            </Main>
            <DiscoveryLog messages={[
                { time: 1592202214316, text: 'Úspěšné spuštění (Michal Struna).' },
                { time: 1592202214516, text: 'KIC 4567123: Analyzuji.' },
                { time: 1592202219316, text: 'KIC 4567123: Nalezeny periodické složky (3).' },
                { time: 1592202219456, text: 'KIC 4567123: Vyřazeny false positive (1).' },
                { time: 1592202219516, text: 'KIC 4567123: Analyzuji složku (T = 23.8 d).' },
                { time: 1592202219816, text: 'KIC 4567123: Analyzuji složku (T = 73.6 d).' },
                { time: 1592202214316, text: 'Úspěšné spuštění (Michal Struna).' },
                { time: 1592202214516, text: 'KIC 4567123: Analyzuji.' },
                { time: 1592202219316, text: 'KIC 4567123: Nalezeny periodické složky (3).' },
                { time: 1592202219456, text: 'KIC 4567123: Vyřazeny false positive (1).' },
                { time: 1592202219516, text: 'KIC 4567123: Analyzuji složku (T = 23.8 d).' },
                { time: 1592202219816, text: 'KIC 4567123: Analyzuji složku (T = 73.6 d).' },
                { time: 1592202214316, text: 'Úspěšné spuštění (Michal Struna).' },
                { time: 1592202214516, text: 'KIC 4567123: Analyzuji.' },
                { time: 1592202219316, text: 'KIC 4567123: Nalezeny periodické složky (3).' },
                { time: 1592202219456, text: 'KIC 4567123: Vyřazeny false positive (1).' },
                { time: 1592202219516, text: 'KIC 4567123: Analyzuji složku (T = 23.8 d).' },
                { time: 1592202219816, text: 'KIC 4567123: Analyzuji složku (T = 73.6 d).' },
                { time: 1592202214316, text: 'Úspěšné spuštění (Michal Struna).' },
                { time: 1592202214516, text: 'KIC 4567123: Analyzuji.' },
                { time: 1592202219316, text: 'KIC 4567123: Nalezeny periodické složky (3).' },
                { time: 1592202219456, text: 'KIC 4567123: Vyřazeny false positive (1).' },
                { time: 1592202219516, text: 'KIC 4567123: Analyzuji složku (T = 23.8 d).' },
                { time: 1592202219816, text: 'KIC 4567123: Analyzuji složku (T = 73.6 d).' }
            ]} />
        </Root>
    )

}

export default Process

/**
 * Název?
 * OS, CPU (GPU?)
 * Aktuální činnost (konzole, posledních 50 činností?)
 * Začátek, doba běhu, prozkoumaných hvězd, objevených kandidátů
 * Zastavit/spustit button, Ukončit button
 */