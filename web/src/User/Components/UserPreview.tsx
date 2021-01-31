import React from 'react'
import Styled, { css } from 'styled-components'
import Countries from 'emoji-flags'

import { Diff, IconText, MiniPrimaryButton } from '../../Layout'
import Auth from './Auth'
import { EditedUser, User, UserPersonal } from '../types'
import { Units, UnitType, useActions, useStrings, uploadFile } from '../../Data'
import { image, dots, size } from '../../Style'
import { logout, edit } from '../Redux/Slice'
import Avatar from './Avatar'
import { Dates } from '../../Native'
import { Field, Form, ImageUpload } from '../../Form'
import { UseFormMethods } from 'react-hook-form'
import { Format } from '../../Native/Utils/Dates'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    user: User
    toggle?: () => void
}

const Root = Styled.div`
    display: flex;
    font-size: 80%;
    overflow: hidden;
    
    ${Avatar.Root} {
        margin: 0.5rem auto;
    }
    
    ${Field.Root} {
        margin: 0.5rem 0;
    }
`

const Name = Styled.h3`
    ${dots()}
    font-size: 120%;
    font-weight: bold;
    text-align: center;
    white-space: nowrap;
`

const ItemValue = Styled.div`
    font-weight: bold;
    
    &:empty {
        display: none;
    }
`

const Left = Styled.div`
    box-sizing: border-box;
    padding: 0.5rem;
    padding-bottom: 0.25rem;
    width: 11rem;
    
    ${ItemValue} {
        font-size: 115%;
    }
`

const EditLeft = Styled(Left)`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 9rem;
`

const Right = Styled.div`
    align-items: flex-start;
    align-content: flex-start;
    box-sizing: border-box;
    padding: 0.5rem;
    position: relative;
    width: 14rem;
    
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    
    & > * {
        ${size('calc(50% - 0.25rem)', 'auto')}
        margin-bottom: 0.5rem;
    }
`

const EditRight = Styled(Right)`
    width: 18rem;
`

const RightMenu = Styled.div`
    align-items: center;
    bottom: 0;
    box-sizing: border-box;
    display: flex;
    left: 0;
    margin-bottom: 0;
    padding: 0.5rem;
    position: absolute;
    width: 100%;
    
    & > * {
        flex: 1 0 0;
    }
`

const Stats = Styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 0.5rem;
    
    div {
        font-size: 0.8rem;
        font-weight: normal;
    }
`

const Rank = Styled.div`
    font-size: 110%;
    text-align: center;
    
    & > div {
        display: inline-block;
    }
`

interface ItemProps {
    value?: React.ReactNode
    title: string
    icon?: string
    full?: boolean
}

interface ItemRootProps {
    icon?: string
}

const ItemRoot = Styled.div<ItemRootProps>`
    ${props => props.icon && (
    props.icon.length > 4 ? css`
        ${image(props.icon, '1.1rem', 'left center')}
        box-sizing: border-box;
        padding-left: 1.5rem;
` : css`
        &:before {
            ${size('1.35rem', '1.35rem', true)}
            content: "${props.icon}";
            display: inline-block;
            margin-right: 0.2rem;
            vertical-align: middle;
        }
`
)}
`

const About = Styled.p`
    opacity: 0.6;
    padding: 0.5rem 0;
    width: 100%;
`

const AboutEditContainer = Styled.div`
    opacity: 0.8;
    width: 100%;
`

const AboutEdit = Styled(Field)`
    ${size('100%', '3rem')}
    padding-left: 0;
    padding-right: 0;
    resize: none;
`

const Item: React.FC<ItemProps> = ({ title, value, icon, full }) => {

    return (
        <ItemRoot icon={icon} style={full ? { width: '100%' } : undefined}>
            {title}
            <ItemValue>{value}</ItemValue>
        </ItemRoot>
    )

}

const Profile = ({ user, toggle, ...props }: Props) => {

    const country = user.personal.country ? (Countries as any).countryCode(user.personal.country) : null
    const actions = useActions({ logout })
    const strings = useStrings()

    return (
        <Root {...props}>
            <Left>
                <Name>
                    {user.name}
                </Name>
                <Avatar user={user} size='7.4rem' />
                <Rank>
                    Planety <ItemValue><Diff {...user.stats.planets} /></ItemValue>
                </Rank>
                <Stats>
                    <Item title='Data' value={<Diff {...user.stats.data} br={true}
                                                    format={val => Units.format(val, UnitType.MEMORY)} />} />
                    <Item title='Čas' value={<Diff {...user.stats.time} br={true}
                                                   format={val => Units.format(val, UnitType.TIME)} />} />
                    <Item title='Křivky' value={<Diff {...user.stats.items} br={true} />} />
                </Stats>
            </Left>
            <Right>
                <Item title='Aktivní'
                      value={user.online ? 'Právě teď' : 'Před ' + Dates.formatDistance(strings, user.modified)}
                      icon='Controls/Active.svg' />
                <Item title='Členem' value={Dates.formatDistance(strings, user.created, undefined, Format.EXACT)}
                      icon='User/Origin.svg' />
                {user.personal.birth || user.personal.sex !== null ? <IconText
                    icon={user.personal.sex ? `User/${{F: 'Female', M: 'Male'}[user.personal.sex]}.svg` : undefined}
                    text={user.personal.birth ? Dates.formatDistance(strings, user.personal.birth, undefined, Format.EXACT) : ''} /> : null}
                {country && (
                    <Item title={country.code} icon={country.emoji} />
                )}
                {user.personal.contact && (
                    <Item title='Kontakt' value={user.personal.contact} icon='User/Contact.svg' full={true} />
                )}
                <About>
                    {user.personal.text || 'Tento uživatel o sobě nic nenapsal.'}
                </About>
                <RightMenu>
                    <Auth identityId={user._id} when={() => (
                        <>
                            <IconText
                                onClick={toggle}
                                icon='Controls/Edit.svg'
                                text={strings.users.edit}
                                size={IconText.SMALL} />
                            <IconText
                                icon='User/Logout.svg'
                                onClick={() => actions.logout()}
                                text={strings.users.logout}
                                size={IconText.SMALL} />
                        </>
                    )} />
                </RightMenu>
            </Right>
        </Root>
    )

}

const UserForm = ({ user, toggle, ...props }: Props) => {

    const actions = useActions({ edit, uploadFile })
    const strings = useStrings()
    const [avatar, setAvatar] = React.useState<File | null>()

    const handleSubmit = async (values: EditedUser, form: UseFormMethods<EditedUser>) => {
        for (const i in values.personal) {
            if (!values.personal[i as keyof UserPersonal]) {
                values.personal[i as keyof UserPersonal] = null as any
            }
        }

        if (values.password === '') {
            delete values.password
        }

        if (values.old_password === '') {
            delete values.old_password
        }

        if (values.personal.birth) {
            values.personal.birth = new Date(values.personal.birth).getTime()
        }

        if (avatar) {
            const uploaded = await actions.uploadFile([avatar, 'avatar'])

            if (!uploaded.error) {
                values.avatar = uploaded.payload
            }
        } else if (avatar === null) {
            values.avatar = avatar
        }

        const action = await actions.edit([user._id, values])

        if (action.error) {
            form.setError(Form.GLOBAL_ERROR, strings.error)
        } else {
            toggle?.()
        }
    }

    const defaultValues = React.useMemo(() => {
        const result: User = JSON.parse(JSON.stringify(user))

        if (result.personal.birth) {
            result.personal.birth = Dates.getDate(result.personal.birth) as any  // Input must be in YYYY-MM-DD.
        }

        return result
    }, [user])

    return (
        <Form onSubmit={handleSubmit} defaultValues={defaultValues}>
            <Root {...props}>
                <EditLeft>
                    <ImageUpload onChange={setAvatar} defaultValue={user.avatar} />
                    <Field name='old_password' type={Field.Type.PASSWORD} label={strings.auth.oldPassword} />
                    <Field name='password' type={Field.Type.PASSWORD} label={strings.auth.password} />
                </EditLeft>
                <EditRight>
                    <Field name='personal.birth' type={Field.Type.DATE} label={strings.users.birth} />
                    <Field name='personal.sex' type={Field.Type.SELECT} label={strings.users.sex} options={[
                        { text: strings.users.emptyInput, value: '' },
                        ...Object.entries(strings.users.sexName).map(([value, text]) => ({
                            text, value
                        }))
                    ]} />
                    <Field name='personal.country' type={Field.Type.SELECT} label={strings.users.country} options={[
                        { text: strings.users.emptyInput, value: '' },
                        ...Countries.data.map(c => ({ text: c.emoji + ' ' + c.name, value: c.code }))
                    ]} />
                    <Field name='personal.contact' type={Field.Type.EMAIL} label={strings.users.contact} />
                    <AboutEditContainer>
                        <AboutEdit name='personal.text' type={Field.Type.TEXTAREA} label={strings.users.text} />
                    </AboutEditContainer>
                    <RightMenu>
                        <Auth identityId={user._id} when={() => (
                            <>
                                <IconText
                                    onClick={toggle}
                                    icon='User/User.svg'
                                    text={strings.users.profile}
                                    size={IconText.SMALL} />
                                <MiniPrimaryButton>
                                    Uložit
                                </MiniPrimaryButton>
                            </>
                        )} />
                    </RightMenu>
                </EditRight>
            </Root>
        </Form>
    )

}

const UserPreview = ({ ...props }: Props) => {

    const [isFormVisible, showForm] = React.useState(false)

    return isFormVisible ? <UserForm {...props} toggle={() => showForm(false)} /> :
        <Profile {...props} toggle={() => showForm(true)} />

}

UserPreview.Root = Root

export default UserPreview