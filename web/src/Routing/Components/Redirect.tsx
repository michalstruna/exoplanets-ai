import React from 'react'
import { Redirect as RouterRedirect, RedirectProps } from 'react-router-dom'

import { Target } from '../types'
import * as Urls from '../Utils/Urls'

interface Props extends RedirectProps {
    to: Target
}


const Redirect = ({ to, ...props }: Props) => {

    return <RouterRedirect to={Urls.merge(to)} {...props} />

}

export default Redirect