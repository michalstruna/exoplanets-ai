import React from 'react'
import Styled from 'styled-components'

import { Link, Url } from '../../Routing'
import { useStrings } from '../../Data'

interface Static {

}

interface Props {

}

const Root = Styled.div`

`

const HelpView: React.FC<Props> & Static = ({ ...props }) => {

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