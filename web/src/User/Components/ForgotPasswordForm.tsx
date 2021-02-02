import React from 'react'
import Styled from 'styled-components'

import { useActions, useStrings } from '../../Data'
import { login, ForgotPasswordData } from '..'
import { Form, Field } from '../../Form'
import { UseFormMethods } from 'react-hook-form'
import { PrimaryButton } from '../../Layout'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    handleLogin?: () => void
    handleSignUp?: () => void
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

const LoginForm = ({ handleLogin, handleSignUp, ...props }: Props) => {

    const actions = useActions({ login })
    const strings = useStrings().auth

    const handleSubmit = async (values: ForgotPasswordData, form: UseFormMethods<ForgotPasswordData>) => {
        /*const action = await actions.login(values) // TODO

        if (action.error) {
            form.setError(Form.GLOBAL_ERROR, strings.error)
        }*/
    }

    return (
        <Root{...props}>
            <Form onSubmit={handleSubmit} defaultValues={{ email: '' }} buttons={[
                [handleLogin, strings.login],
                [handleSignUp, strings.signUp]
            ]}>
                <Field
                    name='email'
                    type={Field.Type.EMAIL}
                    label={strings.email}
                    required={strings.missingEmail}
                    invalid={strings.invalidEmail} />
                <Submit>
                    {strings.resetPassword}
                </Submit>
            </Form>
        </Root>
    )

}

export default LoginForm