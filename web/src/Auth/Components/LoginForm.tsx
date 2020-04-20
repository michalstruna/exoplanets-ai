import * as React from 'react'
import Styled from 'styled-components'

import { Field, FieldType, Form, FormContainer } from '../../Form'
import FacebookLogin from './FacebookLogin'
import GoogleLogin from './GoogleLogin'
import { useActions } from '../../Utils'
import { Color, opacityHover, size } from '../../Style'
import { login } from '../Redux/Reducer'

interface Props extends React.ComponentPropsWithoutRef<'form'> {

}

interface Values {
    email: string
    password: string
}

const Root = Styled(Form)`
    box-sizing: border-box;
    padding: 1rem;
    text-align: center;
    width: 18rem;
`

const Forgot = Styled.button`
    ${opacityHover()}
    border-bottom: 1px solid transparent;
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

const LoginForm: React.FC<Props> = ({ ...props }) => {

    const actions = useActions({ login })

    const handleSubmit = async (values: Values) => {
        const action = await actions.login(values)

        if (action.error) {
            throw strings.error
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
        forgotPassword: 'Zapomenuté heslo?',
        error: 'Špatné přihlašovací údaje.',
        missingEmail: 'Napište svůj email',
        invalidEmail: 'Napište email ve tvaru email@doména.',
        missingPassword: 'Napište své heslo'
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
                    {globalError}
                    <Forgot>
                        {strings.forgotPassword}
                    </Forgot>
                </Root>
            )}
        </FormContainer>
    )
}

export default LoginForm