import React from 'react'
import Styled from 'styled-components'
import { useFormContext } from 'react-hook-form'

import { SecondaryButton } from '../../Layout/Components/Styled'
import { useStrings } from '../../Data'

interface Props extends React.ComponentPropsWithoutRef<'button'> {

}

const Root = Styled(SecondaryButton)`

`

const ResetFormButton = ({ ...props }: Props) => {

    const strings = useStrings().forms
    const { reset } = useFormContext()

    return (
        <Root {...props} onClick={() => reset()} type='button'>
            {strings.reset}
        </Root>
    )

}

export default ResetFormButton