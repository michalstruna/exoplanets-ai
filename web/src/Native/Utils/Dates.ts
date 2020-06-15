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