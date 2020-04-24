import React from 'react'

export default (defaultIndex: number = 0, defaultIsAsc: boolean = true, defaultLevel: number = 0) => {

    const [sortedColumn, setColumn] = React.useState(defaultIndex)
    const [isAsc, setAsc] = React.useState(defaultIsAsc)
    const [sortedLevel, setLevel] = React.useState(defaultLevel)

    const sort = React.useCallback((index: number, level: number = sortedLevel) => {
        const isSameSort = index === sortedColumn && level === sortedLevel
        const newIsAsc = isSameSort ? !isAsc : true

        setColumn(index)
        setLevel(level)
        setAsc(newIsAsc)
    }, [sortedColumn, isAsc, sortedLevel])

    return { sortedColumn, isAsc, sortedLevel, sort }

}