import React from 'react'
import { createGlobalStyle } from 'styled-components'

import { Color, Dimensions, Mixin } from '../../Utils'

const GlobalStyle = createGlobalStyle`
     ${Mixin.FontFace('Montserrat', 'Montserrat.woff2')}
     ${Mixin.FontFace('Montserrat', 'MontserratThin.woff2', '100')}
     ${Mixin.FontFace('Montserrat', 'MontserratBold.woff2', 'bold')}

    body {
        background-color: ${Color.BACKGROUND};
        color: ${Color.LIGHT};
        font-family: Montserrat, Arial;
        margin: 0;
    }
    
    a {
        color: inherit;
        cursor: pointer;
        text-decoration: inherit;
    }
    
    button, input, textarea, select {
        background-color: transparent;
        border: none;
        border-bottom: 1px solid ${Color.MEDIUM_LIGHT};
        color: inherit;
        font-family: Montserrat, Arial;
        font-size: inherit;
        line-height: inherit;
        outline: inherit;
        padding: 0.75rem 0.5rem;
        -webkit-appearance: none;
    }
    
    option {
        background-color: ${Color.MEDIUM_DARK};
        border: none;
        padding: 0.5rem;
        outline: none;
        
        &:hover, &:focus, &:active, &:checked {
           background: ${Color.DARKEST};
        }
    }
    
     button {
        border: none;
        cursor: pointer;
        outline: none;
        text-align: center;
        user-select: none;
     }
      
    p, h1, h2, h3, h4, h5, h6 {
        font-weight: normal;
        margin: 0;
    }
    
    ::-webkit-scrollbar {
        width: 15px;
    }
    
    ::-webkit-scrollbar-track {
        background-color: ${Color.MEDIUM_DARK};
    }
    
    ::-webkit-scrollbar-corner {
        background: rgba(0, 0, 0, 0);
    }
    
    ::-webkit-scrollbar-thumb {
        background-color: #666;
    
        &:hover {
            background-color: #888;
        }
    }
    
    #app {
        background-color: ${Color.MEDIUM_DARK};
         height: calc(100vh - ${Dimensions.NAV_HEIGHT});
         overflow-x: auto;
         overflow-y: auto;
         position: relative;
    }
`
export default GlobalStyle