import React from 'react'
import Styled, { css } from 'styled-components'
import Paginate from 'react-paginate'

import { size, Color, Duration, image } from '../../Style'
import { Numbers } from '../../Native'
import { Segment } from '../types'
import { useStrings } from '../Redux/Selectors'

interface Props extends Omit<React.ComponentPropsWithoutRef<'div'>, 'onChange'> {
    page: Segment
    onChange: (segment: Segment) => void
    itemsCount: number
    freeze?: boolean
    stats?: boolean
    surrounding?: boolean
}

const PAGE = 'paginator__page'
const BREAK = 'paginator__page--break'
const ACTIVE = 'paginator__page--active'
const EDGE = 'paginator__page--edge'

interface RootProps {
    surrounding: boolean
}

const Root = Styled.div<RootProps>`
     user-select: none;
     
     li, ul {
        margin: 0;
        padding: 0;
     }

    .${PAGE}, .${BREAK}, .${EDGE} {
        ${size('auto', '2rem', true)}
        background-color: ${Color.DARKEST};
        box-sizing: border-box;
        display: inline-block;
        overflow: hidden;
        padding: 0 0.2rem;
        text-align: center;
        transition: background-color: ${Duration.MEDIUM};
        min-width: 2.5rem;
        
        &:hover {
            background-color: #2A2A2A;
        }
        
        a {
            ${size()}
            display: block;
            outline: none;
            padding: 0;
        }
    }

    .${BREAK} {
        background-color: transparent;
        pointer-events: none;
        width: 0.5rem;
        min-width: 0;
    }
    
    .${ACTIVE} {
        background-color: transparent;
        pointer-events: none;
    }
    
    .${EDGE} {
        &:first-child {
            ${image('Controls/ArrowLeft.svg', 'auto 50%')}
        }

        &:last-child {
            ${image('Controls/ArrowRight.svg', 'auto 50%')}
        }
    }
    
    ${props => !props.surrounding && css`
        .${BREAK}, .${PAGE}:not(.${ACTIVE}):not(.${EDGE}) {
            display: none;
        }
    `}
`

const Row = Styled.div`
    margin-top: 0.3rem;
    padding: 0 1rem;
    text-align: right;
    white-space: nowrap;
    
    &:first-of-type {
        margin-top: 0;
    }
`

const Stats = Styled.div`
    font-size: 85%;
`

const Line = Styled.div`
    display: inline-block;
    margin-left: 0.5em;
    white-space: nowrap;
`

const PerPage = Styled.select`
    padding: 0.25rem;
    text-align: center;
`

const Paginator = ({ onChange, page, itemsCount, freeze, stats, surrounding, ...props }: Props) => {

    const getPagesCount = React.useCallback(() => Math.ceil(itemsCount / page.size), [itemsCount, page.size])
    const getCache = () => ({ pages: getPagesCount(), itemsCount })
    const strings = useStrings().data.paginator

    const [cache, setCache] = React.useState(getCache())

    React.useEffect(() => {
        const newPagesCount = getPagesCount()

        if (!freeze) {
            setCache({ pages: newPagesCount, itemsCount })
        }
    }, [itemsCount, page, freeze, getPagesCount])

    const handleChangeSize = (size: number) => {
        if (size !== page.size) {
            onChange({ index: 0, size })
        }
    }

    const handleChangePage = (index: number) => {
        if (index !== page.index) {
            onChange({ index, size: page.size })
        }
    }

    return (
        <Root {...props} surrounding={surrounding!}>
            <Row>
                <Paginate
                    activeClassName={ACTIVE}
                    breakClassName={BREAK}
                    breakLabel=' '
                    forcePage={page.index}
                    marginPagesDisplayed={1}
                    nextClassName={EDGE}
                    nextLabel=''
                    onPageChange={page => handleChangePage(page.selected)}
                    pageClassName={PAGE}
                    pageCount={cache.pages}
                    pageRangeDisplayed={5}
                    previousClassName={EDGE}
                    previousLabel='' />
            </Row>
            {stats && <Row>
                <Stats>
                    <Line>
                    {strings.showed} {page.index * page.size + 1}-{Math.min(cache.itemsCount, (page.index + 1) * page.size)} {strings.from} {Numbers.format(cache.itemsCount)}.
                        </Line>
                        <Line>
                        {strings.pageSize} {(
                    <PerPage onChange={event => handleChangeSize(parseInt(event.target.value))} defaultValue={page.size}>
                        {[5, 10, 20, 50, 100, 200].map((value, i) => (
                            <option key={i} value={value}>
                                {value}
                            </option>
                        ))}
                    </PerPage>
                )}.
                        </Line>
                </Stats>
            </Row>}
        </Root>
    )

}

Paginator.Row = Row

Paginator.defaultProps = {
    freeze: false,
    stats: false,
    surrounding: true
}

export default Paginator