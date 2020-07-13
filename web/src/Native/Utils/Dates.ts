import * as Numbers from './Numbers'

const fillZero = (value: number): string => (
    value < 10 ? '0' + value : value.toString()
)

export const formatTime = (date: number, s: boolean = false, ms: boolean = false): string => {
    const dateObj = new Date(date)
    let result = fillZero(dateObj.getHours()) + '.' + fillZero(dateObj.getMinutes())

    if (s) {
        result += ':' + fillZero(dateObj.getSeconds())
    }

    if (ms) {
        result += ',' + fillZero(dateObj.getMilliseconds())
    }

    return result
}

const ms = [31556926000, 86400000, 3600000, 60000, 1000, 1]
const units = ['year', 'day', 'hour', 'minute', 'second', 'millisecond']

export const formatDate = (date: number): string => {
    const obj = new Date(date)

    return `${obj.getDate()}. ${obj.getMonth() + 1}. ${obj.getFullYear()}`
}

export const formatDistance = (strings: any, date1: number, date2?: number, exact: boolean = false): string => {
    const from = date1
    const end = date2 === undefined ? new Date().getTime() : date2
    const diff = end - from

    for (const i in ms) {
        const val = diff / ms[i]

        if (diff / ms[i] >= 1) {
            console.log(val, units[i], diff)
            return (exact ? Numbers.format(val) : Math.floor(val)) + ' ' + strings.units.time[units[i]]
        }
    }

    return '' // TODO
}