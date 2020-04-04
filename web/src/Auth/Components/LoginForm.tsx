import * as React from 'react'
import Styled from 'styled-components'

import { Field, FieldType, Form, FormContainer } from '../../Form'
import FacebookLogin from './FacebookLogin'
import GoogleLogin from './GoogleLogin'
import { Color, Mixin } from '../../Utils'

interface Props extends React.ComponentPropsWithoutRef<'form'> {

}

interface Values {
    email: string
    password: string
}

interface ForgotProps {
    isError: boolean
}

const Root = Styled(Form)`
    box-sizing: border-box;
    text-align: center;
    width: 18rem;
`

const Forgot = Styled.button<ForgotProps>`
    ${Mixin.OpacityHover()}
    border-bottom: 1px solid transparent;
    color: ${({ isError }) => isError ? Color.RED : 'inherit'};
    font-size: 90%;
    margin-top: -1rem;
    text-align: center;
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
        ${Mixin.Size('4rem', '1px')}
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

const LoginForm: React.FC<Props> = ({ ...props }) => {

    const handleSubmit = async (values: Values) => {
        try {
            await new Promise((resolve, reject) => {
                setTimeout(() => reject(), 2000)
            })
        } catch (error) {
            throw error
        }
    }

    const initialValues = {
        email: '',
        password: ''
    }

    const strings = {
        email: 'Email',
        password: 'Heslo',
        submit: 'Připojit se',
        forgotPassword: 'Zapomenuté heslo?'
    } as any // TODO

    return (
        <FormContainer<Values>
            initialValues={initialValues}
            onSubmit={handleSubmit}>
            {({ renderSubmit, globalError }) => (
                <Root {...props}>
                    <External>
                        <FacebookLogin />
                        <GoogleLogin />
                    </External>
                    <HorizontalTextLine>
                        nebo
                    </HorizontalTextLine>
                    <Field
                        type={FieldType.EMAIL}
                        name='email'
                        label={strings.email}
                        required={strings.missingEmail}
                        invalid={strings.invalidEmail} />
                    <Field
                        type={FieldType.PASSWORD}
                        label={strings.password}
                        required={strings.missingPassword}
                        name='password' />
                    {renderSubmit(strings.submit)}
                    <Forgot isError={!!globalError}>
                        {globalError ? strings.errorForgotPassword : strings.forgotPassword}
                    </Forgot>
                </Root>
            )}
        </FormContainer>
    )
}

export default LoginForm