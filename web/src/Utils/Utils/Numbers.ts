import Numeral from 'numeral'

Numeral.localeData().delimiters.thousands = ' '

module Numbers {

    // TODO: Create component React.Fragment and useLanguage?
    export const format = (value: number): string => {
        const abs = Math.abs(value)
        const pattern = abs < 1 ? '0,0.[000]' : (abs < 10 ? '0,0.[00]' : (abs < 100 ? '0,0.[0]' : '0,0'))

        return Numeral(value).format(pattern)
    }

}

export default Numbers