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

export const formatDateTime = (date: number) => {
    return formatDate(date) + ' ' + formatTime(date)
}


export enum Format {
    SHORT,
    EXACT,
    LONG,
    SHORT_NATURE
}

export const formatDistance = (strings: any, date1: number, date2?: number, format: Format = Format.SHORT): string => {
    const from = date1
    const end = date2 === undefined ? new Date().getTime() : date2
    const diff = Math.abs(end - from)

    if (format === Format.LONG) {
        let rest = diff
        let result: string[] = []

        for (const i in ms) {
            if (rest >= ms[i]) {
                const val = Math.floor(rest / ms[i])

                if (val > 0) {
                    rest -= val * ms[i]
                    result.push(`${val} ${strings.units.time[units[i]]}`)

                    if (result.length === 2) {
                        break
                    }
                }
            }
        }

        return result.join(' ') || '0 s'
    } else {
        for (const i in ms) {
            const val = diff / ms[i]

            if (diff / ms[i] >= 1) {
                if (format === Format.EXACT) {
                    return Numbers.format(val)+ ' ' + strings.units.time[units[i]]
                } else if (format === Format.SHORT) {
                    return Math.floor(val) + ' ' + strings.units.time[units[i]]
                } else if (format === Format.SHORT_NATURE) {
                    return parseInt(i) === units.length - 1 ? 'Teď' : Math.floor(val) + ' ' + strings.units.time[units[i]]
                }

                return ''
            }
        }
    }

    return '0 s'
}

export const daysToMs = (days: number) => { // TODO: convert(10, Unit.DAY, UNIT.MS)
    return days * 86400 * 1000
}

export const getDate = (date: number) => {
    return new Date(date).toISOString().split('T')[0]
}