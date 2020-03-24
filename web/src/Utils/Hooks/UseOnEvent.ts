import React from 'react'

type Handler = () => void
type EventInstance = [Element | Window, string]

export default (handler: Handler, eventInstances: EventInstance[]) => {

    const instances = React.useMemo(() => (
        Array.isArray(eventInstances[0]) ? eventInstances : [eventInstances]
    ), [eventInstances]) as EventInstance[]


    React.useEffect(() => {
        for (const [element, event] of instances) {
            if (element) {
                element.addEventListener(event, handler)
            }
        }

        return () => {
            for (const [element, event] of instances) {
                if (element) {
                    element.removeEventListener(event, handler)
                }
            }
        }
    }, [handler, instances])
}