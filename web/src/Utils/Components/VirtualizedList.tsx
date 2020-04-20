import React from 'react'
import Styled from 'styled-components'

import { useEvent } from '../index'

interface Static {

}

interface Props extends React.ComponentPropsWithRef<'div'> {
    itemsCount: number
    itemRenderer: ({ index, style }: { index: number, style: object }) => React.ReactNode
    itemHeight: number | ((index: number) => number)
    scrollable?: React.RefObject<HTMLElement>
}

const Root = Styled.div`
    position: relative;
`

const VirtualizedList: React.FC<Props> & Static = ({ itemsCount, itemRenderer, itemHeight, scrollable, ...props }) => {

    const getItemHeight = (index: number) => typeof itemHeight === 'number' ? itemHeight : itemHeight(index)

    const getIndexRange = (x: number) => {
        const offsetTop = root.current ? root.current.offsetTop : 0
        const scrollableHeight = scrollable && scrollable.current ? scrollable.current.getBoundingClientRect().height : window.innerHeight
        const start = Math.min(totalHeight, Math.max(0, x - offsetTop))
        const end = Math.min(totalHeight, Math.max(0, x - offsetTop + scrollableHeight))

        return [Math.max(0, getIndexByOffset(start) - 1), getIndexByOffset(end)]
    }

    const getIndexByOffset = (offset: number) => {
        let height = 0
        let index = 0

        while (height < offset) {
            height += getItemHeight(index++)
        }

        return index
    }

    const { totalHeight, cumulatedHeights } = React.useMemo(() => {
        let totalHeight = typeof itemHeight === 'number' ? itemHeight : 0
        const cumulatedHeights = [0]

        for (let i = 0; i < itemsCount; i++) {
            const currentHeight = getItemHeight(i)
            totalHeight += currentHeight
            cumulatedHeights.push(cumulatedHeights[cumulatedHeights.length - 1] + currentHeight)
        }

        return { totalHeight, cumulatedHeights }
    }, [itemsCount, itemHeight])

    const root = React.useRef<HTMLDivElement>()

    const [indexRange, setIndexRange] = React.useState(getIndexRange(0))

    const updateIndexRange = () => scrollable?.current && setIndexRange(getIndexRange(scrollable.current.scrollTop))
    useEvent(scrollable?.current && scrollable.current as any, 'scroll', updateIndexRange)
    useEvent(window, 'resize', updateIndexRange)

    React.useEffect(() => {
        if (scrollable) {
            updateIndexRange()
        }
    }, [totalHeight])

    const renderedItems = React.useMemo(() => {
        const renderedItems = []

        for (let i = indexRange[0]; i < indexRange[1]; i++) {
            renderedItems.push(itemRenderer({ index: i, style: { position: 'absolute', top: cumulatedHeights[i] } }))
        }

        return renderedItems
    }, [indexRange[0], indexRange[1], itemRenderer])

    return (
        <Root {...props} style={{ height: totalHeight }} ref={root as any}>
            {renderedItems}
        </Root>
    )

}

VirtualizedList.defaultProps = {
    scrollable: { current: document.body }
}

export default VirtualizedList