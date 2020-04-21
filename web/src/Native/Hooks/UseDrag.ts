import React from 'react'

type Coords = { x: number, y: number }

type Handler<T> = ({ start, current, delta, data }: { start: Coords, current: Coords, delta: Coords, data: T }) => void
type DataGetter<T> = () => T

export default <T>(handler: Handler<T>, getData: DataGetter<T>) => {

    const [start, setStart] = React.useState<{ x: number, y: number } | null>(null)

    return React.useMemo(() => {
        const [data, setData] = React.useState<T>(getData())

        return {
            onMouseDown: (event: React.MouseEvent) => {
                setStart({ x: event.pageX, y: event.pageY })
                getData && setData(getData())
            },
            onMouseMove: (event: React.MouseEvent) => {
                if (start) {
                    const current = { x: event.pageX, y: event.pageY }
                    const delta = { x: current.x - start.x, y: current.y - start.y }

                    handler({ start, current, delta, data })
                }
            },
            onMouseup: () => setStart(null),
            onMouseLeave: () => setStart(null)
        }
    }, [handler, getData, start])

}