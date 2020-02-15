import { css } from 'styled-components'

module Mixin {

    export const FontFace = (name: string, path: string, fontWeight: string = 'normal') => css`
        @font-face {
            font-family: ${name};
            font-weight: ${fontWeight};
            src: url(/fonts/${path});
        }
    `

}

export default Mixin