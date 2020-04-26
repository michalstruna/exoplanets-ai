import React from 'react'
import Styled, { css } from 'styled-components'
import Countries from 'emoji-flags'

import { IconText } from '../../Layout'
import Auth from './Auth'
import { UserSimple } from '../types'
import { useActions } from '../../Data'
import { image, threeDots } from '../../Style'
import { logout } from '../Redux/Slice'

interface Static {
    Root: string
}

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    user: UserSimple
}

const Root = Styled.div`
    display: flex;
    font-size: 80%;
    overflow: hidden;
    user-select: none;
`

const Name = Styled.h3`
    ${threeDots()}
    font-size: 120%;
    font-weight: bold;
    text-align: center;
    white-space: nowrap;
`

const Avatar = Styled.img`
    display: block;
    margin: 1rem auto;
    max-height: 7rem;
    max-width: 7rem;
`

const ItemValue = Styled.div`
    font-weight: bold;
`

const Left = Styled.div`
    box-sizing: border-box;
    padding: 0.5rem;
    width: 12rem;
    
    ${ItemValue} {
        font-size: 115%;
    }
`

const Right = Styled.div`
    box-sizing: border-box;
    padding: 0.5rem;
    padding-left: 1rem;
    width: 15rem;
`

const RightMenu = Styled.div`
    font-size: 105%;
    width: 100%;
    
    & > * {
        display: inline-block;
        text-align: left;
        width: 50%;
    }
`

const Row = Styled.div`
    display: flex;
    margin-top: 0.5rem;
    width: 100%;
    
    & > * {
        box-sizing: border-box;
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
    value: string | number
    title: string
    icon?: string
}

interface ItemRootProps {
    icon?: string
}

const ItemRoot = Styled.div<ItemRootProps>`
    ${props => props.icon && css`
        ${image(props.icon, '1.1rem', 'left center')}
        box-sizing: border-box;
        padding-left: 1.5rem;
    `}
`

const Item: React.FC<ItemProps> = ({ title, value, icon }) => {

    return (
        <ItemRoot icon={icon}>
            {title}
            <ItemValue>{value}</ItemValue>
        </ItemRoot>
    )

}

const UserPreview: React.FC<Props> & Static = ({ user, ...props }) => {

    const country = user.personal.country ? (Countries as any).countryCode(user.personal.country) : null
    const actions = useActions({ logout })

    return (
        <Root {...props}>
            <Left>
                <Name>
                    {user.name}
                </Name>
                <Avatar
                    src='https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Google_Earth_icon.svg/200px-Google_Earth_icon.svg.png' />
                <Rank>
                    Rank <ItemValue>{user.score.rank}.</ItemValue>
                </Rank>
                <Stats>
                    <Item title='Planet' value={user.score.totalPlanets} />
                    <Item title='Hvězd' value={user.score.totalStars} />
                    <Item title='Hodin' value={user.score.time} />
                </Stats>
            </Left>
            <Right>
                <Row>
                    <IconText icon='Auth/Male.svg' text='23 let' />
                    {country && (
                        <div title={country.name}>
                            {country.emoji + ' ' + country.code}
                        </div>
                    )}
                </Row>
                <Row>
                    <Item title='Aktivní' value={'Před ' + 23 + ' m'} icon='Auth/Online.svg' />
                    <Item title='Členem' value='2,2 roku' icon='Auth/Origin.svg' />
                </Row>
                <div style={{ height: '8.8rem' }}>

                </div>
                <RightMenu>
                    <IconText icon='Auth/User.svg' text='Detail' size={IconText.SMALL} />
                    <Auth identityId={user.id} when={() => (
                        <IconText
                            icon='Auth/Logout.svg'
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