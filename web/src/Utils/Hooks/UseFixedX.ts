import { useElement, useEvent } from '../index'

export default (element: HTMLElement) => {
    const { app } = useElement()

    useEvent(app, 'scroll', () => {
        if (element) {
            element.style.transform = `translateX(${app.scrollLeft}px)`
        }
    })
}