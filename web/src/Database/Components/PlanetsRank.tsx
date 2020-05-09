import React from 'react'
import Styled from 'styled-components'
import { IconText, Table, ToggleLine } from '../../Layout'
import { Url } from '../../Routing'
import { Color, size } from '../../Style'

interface Static {

}

interface Props extends React.ComponentPropsWithoutRef<'div'> {

}

const Root = Styled.div`
    background-color: ${Color.MEDIUM_DARK};
    box-sizing: border-box;
    padding: 1rem;
`

const planets = [
    { name: 'Proxima Centauri b', distance: 4.2, diameter: 15535 },
    { name: 'VY Canis Majors', distance: 5.2, diameter: 8963 },
    { name: 'Proxima Centauri b', distance: 4.2, diameter: 12411 },
    { name: 'VY Canis Majors', distance: 5.2, diameter: 13691 },
    { name: 'Proxima Centauri b', distance: 4.2, diameter: 15741 }
]

const icons = ['https://lh5.ggpht.com/DDMIxegFhINdUiET3ZRNj1KQevPoPFSrczPIxUQq-DEwci4rIW3yQNyP3PzV3lYyUxo=h300', 'https://lh3.googleusercontent.com/proxy/bxtbWvj_6zwWSdLMP_9zqYEcpj76LhPRxhj_W27yTSZA7fd_SNUps2HXKHG8TAvJ9oLRTovRyxHa0B6UyPjeGNU']

const PlanetsRank: React.FC<Props> & Static = ({ ...props }) => {

    const earthLike = (
        <Table items={planets} columns={[
            { accessor: (planet, index) => index + 1, title: '#', render: index => index + '.' },
            { accessor: planet => planet.name, title: 'Planeta', render: name => <IconText text={name} icon={icons[Math.floor(Math.random() * 2)]} size={IconText.LARGE} />, width: 10 },
            { accessor: planet => planet.diameter, title: 'Průměr', width: 5 },
            { accessor: planet => planet.distance, title: 'Vzdálenost', width: 5 }
        ]} />
    )

    return (
        <Root {...props}>
            <ToggleLine items={[
                { header: 'Poslední objevené exoplanety', content: earthLike, link: { pathname: Url.DATABASE } },
                { header: 'Zemi nejpodobnější exoplanety', content: earthLike, link: { pathname: Url.DATABASE } },
                { header: 'Nejbližší exoplanety', content: earthLike, link: { pathname: Url.DATABASE } }
            ]} />
        </Root>
    )

}

export default PlanetsRank