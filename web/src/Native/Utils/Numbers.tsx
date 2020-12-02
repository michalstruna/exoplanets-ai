import Numeral from 'numeral'
import React from 'react'

Numeral.localeData().delimiters.thousands = ' '

// TODO: Create component React.Fragment and useLanguage?
export const format = (value: number): string => {
    if (value === undefined || value === null) {
        return ''
    }

    const abs = Math.abs(value)

    if (abs > 0 && abs < 0.001) {
        return toExponential(value)
    }

    const pattern = abs < 1 ? '0,0.[000]' : (abs < 10 ? '0,0.[00]' : (abs < 100 ? '0,0.[0]' : '0,0'))

    return Numeral(value).format(pattern)
}

export const toExponential = (value: number): string => {
    const abs = Math.abs(value)

    return abs >= 0.001 && abs < 1000 ? value.toString() : Numeral(value).format('0,0[e+0]')
}

export const fill0 = (value: number): string => (
    value < 10 ? '0' + value : value.toString()
)

export const formatHours = (degrees: number): React.ReactNode => {
    const hours = Math.floor(degrees / 15)
    let rest = (degrees % 15) / 15 * 60
    const minutes = Math.floor(rest)
    rest = (rest % 1) * 60
    const seconds = rest

    return <>{fill0(hours)}<sup>h</sup>{fill0(minutes)}<sup>m</sup>{format(seconds)}<sup>s</sup></>
}

export const formatDeg = (degrees: number): string => {
    const deg = Math.floor(degrees)
    let rest = (degrees % 1) * 60
    const minutes = Math.floor(rest)
    rest = (rest % 1) * 60
    const seconds = rest

    return fill0(deg) + '° ' + fill0(minutes) + '\' ' + format(seconds) + '\'\''
}

export const formatPercentage = (percentage: number, space: boolean = true): string => (
    format(percentage) + (space ? ' ' : '') + '%'
)

// TODO: Unit tests.
// TODO: Write docs.