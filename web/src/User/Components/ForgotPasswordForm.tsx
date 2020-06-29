import React from 'react'
import Styled from 'styled-components'

import { useActions, useStrings } from '../../Data'
import { login, ForgotPasswordData } from '..'
import { Form, Field } from '../../Form'
import { FormContextValues } from 'react-hook-form'
import { PrimaryButton } from '../../Layout'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    handleLogin?: () => void
    handleNoAccount?: () => void
}

const Root = Styled.div`
    box-sizing: border-box;
    padding: 1rem;
    text-align: center;
    width: 18rem;
`

const Submit = Styled(PrimaryButton)`
    font-size: 100%;
`

const LoginForm = ({ handleLogin, handleNoAccount, ...props }: Props) => {

    const actions = useActions({ login })
    const strings = useStrings().login

    const handleSubmit = async (values: ForgotPasswordData, form: FormContextValues<ForgotPasswordData>) => {
        /*const action = await actions.login(values) // TODO

        if (action.error) {
            form.setError(Form.GLOBAL_ERROR, strings.error)
        }*/
    }

    return (
        <Root{...props}>
            <Form onSubmit={handleSubmit} defaultValues={{ email: '' }} buttons={[
                [handleLogin, strings.knowPassword],
                [handleNoAccount, strings.noAccount]
            ]}>
                <Field
                    name='email'
                    type={Field.Type.EMAIL}
                    label={strings.email}
                    required={strings.missingEmail}
                    invalid={strings.invalidEmail} />
                <Submit>
                    {strings.remindPassword}
                </Submit>
            </Form>
        </Root>
    )

}

export default LoginForm