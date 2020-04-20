import React from 'react'
import Styled from 'styled-components'

import { Dimension, Duration, Mixins, Color } from '../../Style'
import { useStrings } from '../../Content'
import { Link } from '../../Routing'

interface Static {

}

interface Props extends React.ComponentPropsWithoutRef<'nav'> {

}

const Root = Styled.nav`
    ${Mixins.Size('35rem', Dimension.NAV_HEIGHT, true)}
    display: flex;
    justify-content: space-around;
    user-select: none;
`

interface NavLinkProps {
    icon: string
}

const NavLink = Styled(Link)<NavLinkProps>`
    background-color: transparent;
    opacity: 0.6;
    text-align: center;
    transition: background-color ${Duration.MEDIUM}, opacity ${Duration.MEDIUM};
    width: 100%;
    
    &:before {
        ${props => Mixins.Image(`Core/Nav/${props.icon}.svg`)}
        ${Mixins.Size('1.5rem', '100%')}
        content: "";
        display: inline-block;
        margin-right: 0.75rem;
        vertical-align: bottom;
    }
    
    &.${Link.ACTIVE}, &:hover {
        opacity: 1;
    }
    
    &.${Link.ACTIVE} {
        background-color: ${Color.MEDIUM_DARK};
    }
`

const Nav: React.FC<Props> & Static = ({ ...props }) => {

    const strings = useStrings().nav

    const renderedLinks = React.useMemo(() => (
        strings.links.map(({ text, icon, ...link }: any, i: number) => (
            <NavLink {...link} key={i} icon={icon}>
                {text}
            </NavLink>
        ))
    ), [strings])

    return (
        <Root {...props}>
            {renderedLinks}
        </Root>
    )

}

export default Nav