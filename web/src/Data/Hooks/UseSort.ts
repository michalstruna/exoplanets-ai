import React from 'react'

export default (defaultIndex: number | undefined, defaultIsAsc: boolean | undefined, defaultLevel: number | undefined) => {

    const [sortedColumn, setColumn] = React.useState(defaultIndex)
    const [isAsc, setAsc] = React.useState(defaultIsAsc)
    const [sortedLevel, setLevel] = React.useState(defaultLevel)

    const sort = React.useCallback((index: number | undefined, level: number | undefined = sortedLevel) => {
        const isSameSort = index === sortedColumn && level === sortedLevel
        const newIsAsc = isSameSort ? !isAsc : true

        if (isSameSort && !isAsc) {
            setColumn(undefined)
            setLevel(undefined)
            setAsc(undefined)
        } else {
            setColumn(index)
            setLevel(level)
            setAsc(newIsAsc)
        }
    }, [sortedColumn, isAsc, sortedLevel])

    return { sortedColumn, isAsc, sortedLevel, sort }

}