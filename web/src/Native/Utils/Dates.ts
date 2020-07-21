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

const ms = [31556926000, 86400000, 3600000, 60000, 1000]
const units = ['year', 'day', 'hour', 'minute', 'second']

export const formatDate = (date: number): string => {
    const obj = new Date(date)

    return `${obj.getDate()}. ${obj.getMonth() + 1}. ${obj.getFullYear()}`
}


export enum Format {
    SHORT,
    EXACT,
    LONG
}

export const formatDistance = (strings: any, date1: number, date2?: number, format: Format = Format.SHORT): string => {
    const from = date1
    const end = date2 === undefined ? new Date().getTime() : date2
    const diff = end - from

    if (format === Format.LONG) {
        let rest = diff
        let result: string[] = []

        for (const i in ms) {
            if (rest >= ms[i]) {
                const val = Math.floor(rest / ms[i])

                if (val > 0) {
                    rest -= val * ms[i]
                    result.push(`${val} ${strings.units.time[units[i]]}`)
                }
            }
        }

        return result.join(' ') || '0 s'
    } else {
        for (const i in ms) {
            const val = diff / ms[i]

            if (diff / ms[i] >= 1) {
                return (format === Format.EXACT ? Numbers.format(val) : Math.floor(val)) + ' ' + strings.units.time[units[i]]
            }
        }
    }

    return '0 s'
}