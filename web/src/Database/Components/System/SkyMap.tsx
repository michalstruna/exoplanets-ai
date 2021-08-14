import React from 'react'
import Styled from 'styled-components'
import { Async } from '../../../Async'
import { useSelector } from '../../../Data'

import { Color, size } from '../../../Style'
import { getConstellations } from '../../Redux/Slice'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    target: string
}

const Root = Styled.div`
    ${size('35rem', '20rem')}
    border: none;
    
    .aladin-location {
        background-color: rgba(0, 0, 0, 0.5);
        bottom: 0;
        padding-left: 5rem;
        top: auto;
    }
    
    .aladin-frameChoice {
        padding: 0.1rem 0;
    }
    
    .aladin-fov {
        background-color: transparent;
        color: ${Color.LIGHTEST};
        font-weight: normal;
        padding: 0.3rem;
    }
    
    .aladin-gotoControl-container, .aladin-gotoBox {
        background-color: ${Color.MEDIUM};
        color: white;
        left: 0;
        top: 0;
    }
`

var renderLabel = function (source: any, ctx: CanvasRenderingContext2D, viewParams: any) {
    const fov = Math.max(viewParams['fov'][0], viewParams['fov'][1])
    ctx.textAlign = 'center'
    ctx.font = '20px Arial'
    ctx.fillStyle = '#eee'
    ctx.fillText(source.data['name'], source.x, source.y - 5 / fov)
}

declare var A: any

const SkyMap = ({ target, ...props }: Props) => {

    const cons = useSelector(state => state.database.constellations)

    React.useEffect(() => {
        setTimeout(() => {
            if (!cons.payload) {
                return
            }

            const aladin = A.aladin('#aladin-lite', {
                survey: 'P/DSS2/color',
                fov: 0.1,
                target,
                showZoomControl: false,
                showLayersControl: false
            })
    
            const constellations = A.graphicOverlay({ lineWidth: 1, color: '#FFF' })
            aladin.addOverlay(constellations)
    
            const constellationLabels = A.catalog({ name: 'Labels', shape: renderLabel })
            aladin.addCatalog(constellationLabels)
    
            for (const con of cons.payload) {
                for (const line of con.shape) {
                    constellations.add(A.polyline(line))
                }
    
                var label = A.source(con.center[0], con.center[1], { name: con.name })
                constellationLabels.addSources([label])
            }
        }, 100)
    }, [target, cons])

    return (
        <Async
            data={[[cons, getConstellations, [target]]]}
            success={() => <Root {...props} id='aladin-lite' />} />
    )

}

export default SkyMap