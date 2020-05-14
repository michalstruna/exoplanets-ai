import React from 'react'
import Styled from 'styled-components'

import { Link, Url } from '../../Routing'
import { useStrings } from '../../Data'

interface Props {

}

const Root = Styled.div`

`

const HelpView = ({ ...props }: Props) => {

    const strings = useStrings().help

    return (
        <Root {...props}>
            <Link pathname={Url.HOME}>
                {strings.home}
            </Link>
        </Root>
    )

}

export default HelpView