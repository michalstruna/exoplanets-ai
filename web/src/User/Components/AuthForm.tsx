import React from 'react'
import Styled from 'styled-components'
import LoginForm from './LoginForm'
import { ForgotPasswordForm, SignUpForm } from '../index'

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

const Root = Styled.div`

`

enum Tab {
    LOGIN,
    SIGN_UP,
    RESET_PASSWORD
}

const AuthForm = ({ ...props }: Props) => {

    const [tab, setTab] = React.useState(Tab.LOGIN)

    const currentForm = React.useMemo(() => {
        if (tab === Tab.LOGIN) {
            return (
                <LoginForm
                    handleSignUp={() => setTab(Tab.SIGN_UP)}
                    handleResetPassword={() => setTab(Tab.RESET_PASSWORD)} />
            )
        } else if (tab === Tab.SIGN_UP) {
            return (
                <SignUpForm handleLogin={() => setTab(Tab.LOGIN)} />
            )
        } else if (tab === Tab.RESET_PASSWORD) {
            return (
                <ForgotPasswordForm
                    handleLogin={() => setTab(Tab.LOGIN)}
                    handleSignUp={() => setTab(Tab.SIGN_UP)} />
            )
        }
    }, [tab])

    return (
        <Root {...props}>
            {currentForm}
        </Root>
    )

}

export default AuthForm