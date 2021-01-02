import React from 'react'
import Styled, { css } from 'styled-components'
import { Link, LinkData } from '../../Routing'
import { Duration, image, size } from '../../Style'

interface Props extends Omit<React.ComponentPropsWithoutRef<'a'>, 'title'>, LinkData {
    title: React.ReactNode
    subtitle: React.ReactNode
}

const Root = Styled(Link)<LinkData>`
    ${size()}
    align-items: center;
    display: flex;
    
    ${props => props.pathname && css`
        &:after {   
            ${image('Controls/ArrowRight.svg', '80%')}
            ${size('1rem')}
            content: "";
            display: inline-block;
            margin-left: 0.5rem;
            opacity: 0.8;
            vertical-align: middle;
            transition: transform ${Duration.MEDIUM}, opacity ${Duration.MEDIUM};
        }
    `}
`

const TableItemDetail = ({ title, subtitle, ...props }: Props) => {

    return (
        <Root {...props}>
            <div>
                <b>{title}</b>
                <br />
                <i>{subtitle}</i>
            </div>
        </Root>
    )

}

TableItemDetail.Root = Root


export default TableItemDetail