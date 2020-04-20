import * as React from 'react'
import useRouter from 'use-react-router'
import Styled from 'styled-components'
import { NavLink } from 'react-router-dom'

import { Target } from '../types'
import { Validator } from '../../Utils'
import * as Urls from '../Utils/Urls'

export interface Static {
    ACTIVE: string
}

export interface Props extends Target, React.ComponentPropsWithoutRef<'a'> {
    replace?: boolean
}

export type Type = React.FC<Props> & Static

const Root = Styled(NavLink)`
    cursor: pointer;
    display: inline-block;
    
    &.active {
        cursor: default;
        pointer-events: none;
    }
`

const AbsoluteRoot = Styled.a`
    cursor: pointer;
    display: inline-block;
`

const Link: Type = ({ hash, query, pathname, replace, ...props }) => {

    const { location } = useRouter()
    const target = { hash, query, pathname }

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault()

        if (props.onClick) {
            props.onClick(event)
        } else {
            if (replace) {
                Urls.replace({ hash, query, pathname })
            } else {
                Urls.push({ hash, query, pathname })
            }
        }
    }

    if (pathname && (/^https?:/.test(pathname) || /.pdf$/.test(pathname))) {
        return (
            <AbsoluteRoot {...props} href={pathname} target='_blank' />
        )
    }

    if (pathname && Validator.isEmail(pathname)) {
        return (
            <AbsoluteRoot {...props} href={`mailto:${pathname}`} />
        )
    }

    const isActive = Urls.isCurrent(location, target)

    return (
        <Root
            {...props as any}
            data-active={isActive || undefined}
            onClick={handleClick}
            isActive={() => isActive}
            exact
            to={Urls.merge(target, location)}
            activeClassName={Link.ACTIVE} />
    )
}

Link.ACTIVE = 'active'

export default Link

export { default as Url } from '../Constants/Url'
export { default as Query } from '../Constants/Query'