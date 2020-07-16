import Numeral from 'numeral'

Numeral.localeData().delimiters.thousands = ' '

// TODO: Create component React.Fragment and useLanguage?
export const format = (value: number): string => {
    if (value === undefined || value === null) {
        return ''
    }

    const abs = Math.abs(value)
    const pattern = abs < 1 ? '0,0.[000]' : (abs < 10 ? '0,0.[00]' : (abs < 100 ? '0,0.[0]' : '0,0'))

    return Numeral(value).format(pattern)
}

export const toExponential = (value: number): string => {
    return Math.abs(value) < 1000 ? value.toString() : Numeral(value).format('0,0[e+0]')
}

// TODO: Unit tests.
// TODO: Write docs.