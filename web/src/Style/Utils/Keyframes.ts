import { keyframes } from 'styled-components'

export const fadeIn = keyframes`
        from {
            opacity: 0;
        }
        
        to {
            opacity: 1;
        }
    
    `

export const levitate = keyframes`
        0% {
            transform: translateY(-10%);
        }

        50% {
            transform: translateY(10%);
        }

        100% {
            transform: translateY(-10%);
        }
    `

export const zoomIn = keyframes`
    from {
        transform: scale(0);
    }
    
    to {
        transform: scale(1);
    }

`