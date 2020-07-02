import React from 'react'
import Styled from 'styled-components'

import { useActions, useStrings } from '../../Data'
import { login, Credentials } from '..'
import { Color, size } from '../../Style'
import FacebookLogin from './FacebookLogin'
import GoogleLogin from './GoogleLogin'
import { Form, Field } from '../../Form'
import { FormContextValues } from 'react-hook-form'
import { PrimaryButton } from '../../Layout'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    handleSignUp?: () => void
    handleResetPassword?: () => void
}

const Root = Styled.div`
    box-sizing: border-box;
    padding: 1rem;
    text-align: center;
    width: 18rem;
`

const External = Styled.section`
    display: flex;
    justify-content: center;
    
    & > button {
        width: 100%;
    
        &:first-of-type {
            margin-right: 0.5rem;
        }
    }
`

const HorizontalTextLine = Styled.div`
    color: ${Color.LIGHT};
    margin: 1rem 0;
    opacity: 0.5;
    text-align: center;
    
    &:before, &:after {
        ${size('4rem', '1px')}
        background-color: ${Color.LIGHT};
        content: "";
        display: inline-block;
        transform: translateY(-0.2rem);
    }
    
    &:after {
        margin-left: 0.5rem;
    }
    
    &:before {
        margin-right: 0.5rem;
    }
`

const Submit = Styled(PrimaryButton)`
    font-size: 100%;
`

const LoginForm = ({ handleSignUp, handleResetPassword, ...props }: Props) => {

    const actions = useActions({ login })
    const strings = useStrings().auth

    const handleSubmit = async (values: Credentials, form: FormContextValues<Credentials>) => {
        const action = await actions.login(values)

        if (action.error) {
            form.setError(Form.GLOBAL_ERROR, strings.error)
        }
    }

    return (
        <Root{...props}>
            <Form onSubmit={handleSubmit} defaultValues={{ email: '', password: '' }} buttons={[
                [handleSignUp, strings.signUp],
                [handleResetPassword, strings.resetPassword]
            ]}>
                <External>
                    <FacebookLogin />
                    <GoogleLogin />
                </External>
                <HorizontalTextLine>
                    {strings.or}
                </HorizontalTextLine>
                <Field
                    name='email'
                    type={Field.Type.EMAIL}
                    label={strings.email}
                    required={strings.missingEmail}
                    invalid={strings.invalidEmail} />
                <Field
                    name='password'
                    type={Field.Type.PASSWORD}
                    label={strings.password}
                    required={strings.missingPassword} />
                <Submit>
                    {strings.login}
                </Submit>
            </Form>
        </Root>
    )

}

export default LoginForm