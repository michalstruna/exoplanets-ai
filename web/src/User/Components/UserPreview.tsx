import React from 'react'
import Styled, { css } from 'styled-components'
import Countries from 'emoji-flags'

import { Diff, IconText } from '../../Layout'
import Auth from './Auth'
import { User } from '../types'
import { useActions, useStrings } from '../../Data'
import { image, dots, size } from '../../Style'
import { logout } from '../Redux/Slice'
import Avatar from './Avatar'
import { Dates, Numbers } from '../../Native'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    user: User
}

const Root = Styled.div`
    display: flex;
    font-size: 80%;
    overflow: hidden;
    
    ${Avatar.Root} {
        margin: 0.5rem auto;
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
    width: 12rem;
    
    ${ItemValue} {
        font-size: 115%;
    }
`

const Right = Styled.div`
    align-items:flex-start;
    align-content:flex-start;
    box-sizing: border-box;
    padding: 0.5rem;
    position: relative;
    width: 14rem;
    
    display: flex;
    flex-wrap: wrap;
    
    & > * {
        ${size('50%', 'auto')}
        margin-bottom: 0.5rem;
    }
`

const RightMenu = Styled.div`
    bottom: 0;
    box-sizing: border-box;
    font-size: 105%;
    left: 0;
    margin-bottom: 0;
    padding: 0.5rem;
    position: absolute;
    width: 100%;
    
    & > * {
        display: inline-block;
        float: left;
        text-align: left;
        width: 50%;
    }
`

const Stats = Styled.div`
    display: flex;
    margin-top: 0.5rem;
    
    & > div {
        width: 33%;
        
        &:first-of-type {
            width: 34%;
        }
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

const Item: React.FC<ItemProps> = ({ title, value, icon, full }) => {

    return (
        <ItemRoot icon={icon} style={full ? { width: '100%' } : undefined}>
            {title}
            <ItemValue>{value}</ItemValue>
        </ItemRoot>
    )

}

const UserPreview = ({ user, ...props }: Props) => {

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
                    Planet <ItemValue><Diff {...user.stats.planets} /></ItemValue>
                </Rank>
                <Stats>
                    <Item title='Křivek' value={<Diff {...user.stats.items} br={true} />} />
                    <Item title='GiB' value={<Diff {...user.stats.data} br={true} format={val => Numbers.format(val / 1024**3)} />} />
                    <Item title='Hodin' value={<Diff {...user.stats.time} br={true} />} />
                </Stats>
            </Left>
            <Right>
                <Item title='Aktivní' value={user.online ? 'Právě teď' : 'Před ' + Dates.formatDistance(strings, user.modified)} icon='Controls/Active.svg' />
                <Item title='Členem' value={Dates.formatDistance(strings, user.created, new Date().getTime())} icon='User/Origin.svg' />
                <IconText icon={typeof user.personal.sex === 'boolean' ? `User/${user.personal.sex ? 'Female' : 'Male'}.svg` : `User/Sex.svg`} text='23 let' />
                {country && (
                    <Item title={country.code} icon={country.emoji} />
                )}
                {true && (
                    <Item title='Kontakt' value={user.personal.contact} icon='User/Contact.svg' full={true} />
                )}
                <About>
                    {user.personal.text || 'Tento uživatel o sobě nic nenapsal.'}
                </About>
                <RightMenu>
                    <IconText icon='User/User.svg' text='Detail' size={IconText.SMALL} />
                    <Auth identityId={user._id} when={() => (
                        <IconText
                            icon='User/Logout.svg'
                            onClick={() => actions.logout()}
                            text='Odhlásit se'
                            size={IconText.SMALL} />
                    )} />
                </RightMenu>
            </Right>
        </Root>
    )

}

UserPreview.Root = Root

export default UserPreview