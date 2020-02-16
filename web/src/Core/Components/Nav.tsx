import React from 'react'
import Styled from 'styled-components'

import { Dimensions, Duration, Mixin } from '../../Utils'
import Color from '../../Utils/Constants/Color'
import { useStrings } from '../../Content'
import { Link, LinkData } from '../../Routing'

interface Static {

}

interface Props extends React.ComponentPropsWithoutRef<'nav'> {

}

const Root = Styled.nav`
    ${Mixin.Size('35rem', Dimensions.NAV_HEIGHT, true)}
    display: flex;
    justify-content: space-around;
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
        ${props => Mixin.Image(`Core/Nav/${props.icon}.svg`)}
        ${Mixin.Size('1.5rem', '100%')}
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
        strings.links.map(({ text, icon, ...link }, i) => (
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