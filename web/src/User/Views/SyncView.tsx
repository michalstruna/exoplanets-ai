import React from 'react'
import Styled from 'styled-components'

import LoginForm from '../Components/LoginForm'
import Auth from '../Components/Auth'
import UserRole from '../Constants/UserRole'
import { Color, flexCenter, opacityHover } from '../../Style'
import { PageTitle, PrimaryButton } from '../../Layout'
import { useIdentity, logout } from '..'
import UserName from '../Components/UserName'
import { useActions, useStrings } from '../../Data'

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

const Root = Styled.div`    
    ${flexCenter()}
    background-color: ${Color.BACKGROUND};
    height: 100%;
`

const Inner = Styled.div`
    background-color: ${Color.MEDIUM_DARK};
    padding: 0.5rem;
    position: relative;
    max-width: 18rem;
    
    & > div {
        margin: 0 auto;
    }
    
     ${PageTitle} {
        margin-bottom: 2rem;
        text-align: center;
    }
`

const Description = Styled.p`

    & > div {
        display: inline-block;
        font-weight: bold;
        margin-left: 0.5rem;
        vertical-align: middle;
        width: auto;
    }
`

const Submit = Styled(PrimaryButton)`
    margin-top: 1.5rem;
`

const LogoutButton = Styled.button`
    ${opacityHover()}
    font-size: 80%;
    margin-top: 1.5rem;
    text-align: center;
    width: 100%;
`

const SyncView = ({ ...props }: Props) => {

    const identity = useIdentity()
    const strings = useStrings().sync
    const actions = useActions({ logout })

    return (
        <Root {...props}>
            <Auth
                role={UserRole.UNAUTHENTICATED}
                when={() => (
                    <Inner>
                        <PageTitle>
                            {strings.login}
                        </PageTitle>
                        <LoginForm />
                    </Inner>
                )}
                otherwise={() => (
                    <Inner>
                        <Inner>
                            <Description>
                                {strings.confirm} <UserName user={identity.payload} />?
                            </Description>
                            <Submit>
                                {strings.submit}
                            </Submit>
                            <LogoutButton onClick={() => actions.logout()}>
                                {strings.changeIdentity}
                            </LogoutButton>
                        </Inner>
                    </Inner>
                )}/>
        </Root>
    )

}

export default SyncView