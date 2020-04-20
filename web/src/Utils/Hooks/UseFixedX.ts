import { useElement, useEvent } from '../index'

export default (element: React.RefObject<HTMLElement>) => {
    const { app } = useElement()

    useEvent(app.current as any, 'scroll', () => {
        if (element.current) {
            element.current.style.transform = app.current ? `translateX(${app.current.scrollLeft}px)` : ''
        }
    })
}