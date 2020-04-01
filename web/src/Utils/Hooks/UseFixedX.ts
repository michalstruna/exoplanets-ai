import { useElement, useEvent } from '../index'

export default (element: React.RefObject<HTMLElement>) => {
    const { app } = useElement()

    useEvent(app.current, 'scroll', () => {
        if (element.current) {
            element.current.style.transform = `translateX(${app.current.scrollLeft}px)`
        }
    })
}