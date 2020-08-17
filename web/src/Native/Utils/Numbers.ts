import Numeral from 'numeral'

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

    return abs >= 0.001 &&  abs < 1000 ? value.toString() : Numeral(value).format('0,0[e+0]')
}

// TODO: Unit tests.
// TODO: Write docs.