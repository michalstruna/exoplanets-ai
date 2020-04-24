import * as Arrays from './Arrays'

describe('findLastIndex', () => {
    test('last index of x > 3 in [6, 5, 4, 3, 2, 1] should be 2', () => {
        expect(Arrays.findLastIndex([6, 5, 4, 3, 2, 1], x => x > 3)).toBe(2)
    })

    test('last index of i < 4 in [6, 5, 4, 3, 2, 1] should be 2', () => {
        expect(Arrays.findLastIndex([6, 5, 4, 3, 2, 1], (x, i) => i < 4)).toBe(3)
    })

    test('last index of x > 3 where index is bigger than 2 in [6, 5, 4, 3, 2, 1] should be -1', () => {
        expect(Arrays.findLastIndex([6, 5, 4, 3, 2, 1], (x, i) => x > 3 && i > 2)).toBe(-1)
    })

    test('last index of x === true in [false, false, false] should be -1', () => {
        expect(Arrays.findLastIndex([false, false, false], x => x)).toBe(-1)
    })
})