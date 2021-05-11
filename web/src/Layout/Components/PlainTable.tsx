import React from 'react'
import Styled from 'styled-components'

interface Props extends React.ComponentPropsWithoutRef<'table'> {

}

const Root = Styled.table`
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-collapse: collapse;
    margin: 1rem 0;
    table-layout: fixed;
    width: 100%;
    
    tr {
        &:nth-of-type(2n + 1) td:nth-of-type(2n + 1) {
            background-color: rgba(0, 0, 0, 0.1);
        }
        
        &:nth-of-type(2n) td:nth-of-type(2n) {
            background-color: rgba(0, 0, 0, 0.1);
        }
    }

    td, th {
        padding: 0.75rem 1rem;
        width: 50%;
    
        &:nth-of-type(2n + 1) {
            text-align: right;
        }
    }
    
    th {
        background-color: rgba(0, 0, 0, 0.15);
        text-align: center !important;
    }
`

const PlainTable = ({ ...props }: Props) => {

    return (
        <Root {...props}>
            
        </Root>
    )

}
export default PlainTable