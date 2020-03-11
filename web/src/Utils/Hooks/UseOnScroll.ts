import React from 'react'

export default (handler: (x: number, y: number) => void, element: Element = document.body) => {
    React.useEffect(() => {
        if (!element) {
            return
        }

        const handleScroll = () => handler(element.scrollTop, element.scrollLeft)
        element.addEventListener('scroll', handleScroll)

        return () => {
            element.removeEventListener('scroll', handleScroll)
        }
    }, [handler, element])
}