import React from 'react'
import Styled from 'styled-components'

interface Props extends React.ComponentPropsWithoutRef<'canvas'> {
    data: number[]
    simple?: boolean
    color?: string
}

const Root = Styled.div`
    display: flex;
    position: relative;
    user-select: none;
    width: 100%;
    max-width: 40rem;
`

const Image = Styled.img`
    pointer-events: none;
    width: 100%;
`

const Vertical = Styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    width: calc(100% - 2.5rem);
`

const Tick = Styled.p`
    font-size: 70%;
`

const YAxis = Styled.div`
    align-self: stretch;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 3rem;
`

const XAxis = Styled(YAxis)`
    box-sizing: border-box;
    flex-direction: row;
    margin-top: 0.5rem;
    width: 100%;
`

const Curve = ({ data, simple, color, ...props }: Props) => {

    return (
        <Root style={{ backgroundSize: '100% auto', height: '100%', width: '100%' }}>
            <YAxis style={simple ? undefined : { paddingBottom: '1rem' }}>
                <Tick>1.0000</Tick>
                <Tick>0.9998</Tick>
                <Tick>0.9996</Tick>
                <Tick>0.9994</Tick>
            </YAxis>
            <Vertical>
                <Image src={`/img/lc.png`} />
                {!simple && (
                    <XAxis>
                        <Tick>100</Tick>
                        <Tick>133</Tick>
                        <Tick>166</Tick>
                        <Tick>200</Tick>
                    </XAxis>
                )}
            </Vertical>
        </Root>
    )

}

export default Curve