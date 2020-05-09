import React from 'react'
import Styled from 'styled-components'

import { useActions } from '../../Data'
import { login } from '..'
import { Color, opacityHover, size } from '../../Style'
import FacebookLogin from './FacebookLogin'
import GoogleLogin from './GoogleLogin'
import { Form, Field } from '../../Form'

interface Static {

}

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

const Root = Styled.div`
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

interface Values { // TODO: Interface Credentials.
    email: string
    password: string
}

const LoginForm: React.FC<Props> & Static = ({ ...props }) => {

    const actions = useActions({ login })

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

    const handleSubmit = async (values: Values, form: any) => {
        const action = await actions.login(values as any)

        if (action.error) {
            form.setError(Form.GLOBAL_ERROR, strings.error)
        }
    }

    return (
        <Root{...props}>
            <Form onSubmit={handleSubmit as any} defaultValues={{ email: '', password: '' }}>
                <External>
                    <FacebookLogin />
                    <GoogleLogin />
                </External>
                <HorizontalTextLine>
                    nebo
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
                <button>
                    {strings.submit}
                </button>
            </Form>
            <Forgot type='button'>
                {strings.forgotPassword}
            </Forgot>
        </Root>
    )

}

export default LoginForm