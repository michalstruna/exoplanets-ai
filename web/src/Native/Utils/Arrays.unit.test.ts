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

describe('equals', () => {
    test('[] should equals []', () => {
        expect(Arrays.equals([], [])).toBeTruthy()
    })

    test('[1] should equals [1]', () => {
        expect(Arrays.equals([1], [1])).toBeTruthy()
    })

    test('["a", "b", "c"] should equals ["a", "b", "c"]', () => {
        expect(Arrays.equals(['a', 'b', 'c'], ['a', 'b', 'c'])).toBeTruthy()
    })

    test('[{}] should equals [{}]', () => {
        expect(Arrays.equals([{}], [{}])).toBeTruthy()
    })

    test('[{ x: 1 }] should equals [{ x: 1 }]', () => {
        expect(Arrays.equals([{ x: 1 }], [{ x: 1 }])).toBeTruthy()
    })

    test('[] should not equals [1]', () => {
        expect(Arrays.equals([], [1])).toBeFalsy()
    })

    test('[9] should not equals [7]', () => {
        expect(Arrays.equals([9], [7])).toBeFalsy()
    })

    /*test('[{ x: 1 }] should not equals [{ x: 2 }]', () => {
        expect(Arrays.equals([{ x: 1 }], [{ x: 2 }])).toBeFalsy()
    })*/ // TODO: Fix.

    test('["a", "b", "c"] should not equals ["a", "b", "d"]', () => {
        expect(Arrays.equals(['a', 'b', 'c'], ['a', 'b', 'd'])).toBeFalsy()
    })

    test('[7, 8, 9, 10] should not equals [7, 8, 9]', () => {
        expect(Arrays.equals([7, 8, 9, 10], [7, 8, 9])).toBeFalsy()
    })

    test('[7, 8, 9] should not equals [7, 8, 9, 10]', () => {
        expect(Arrays.equals([7, 8, 9], [7, 8, 9, 10])).toBeFalsy()
    })

    /*test('[undefined] should not equals [null]', () => {
        expect(Arrays.equals([undefined], [null])).toBeFalsy()
    })

    test('[undefined] should not equals []', () => {
        expect(Arrays.equals([undefined], [])).toBeFalsy()
    })

    test('[] should not equals [null]', () => {
        expect(Arrays.equals([], [null])).toBeFalsy()
    })*/ // TODO: Fix.
})


describe('range', () => {
    test('range from 2 to 3 should be [2, 3]', () => {
        expect(Arrays.equals(Arrays.range(2, 3), [2, 3])).toBeTruthy()
    })

    test('range from 2 to 3 by 0.5 should be [2, 2,5, 3]', () => {
        expect(Arrays.equals(Arrays.range(2, 3, 0.5), [2, 2.5, 3])).toBeTruthy()
    })

    test('range from 2 to 4 by 3 should be [2]', () => {
        expect(Arrays.equals(Arrays.range(2, 4, 3), [2])).toBeTruthy()
    })

    test('range from -5 to 2 by 2 should be [-5, -3, -1, 1]', () => {
        expect(Arrays.equals(Arrays.range(-5, 2, 2), [-5, -3, -1, 1])).toBeTruthy()
    })

    test('range from 2 to 0 should be [2, 1, 0]', () => {
        expect(Arrays.equals(Arrays.range(2, 0), [2, 1, 0])).toBeTruthy()
    })

    test('range from 5, 1 by 2 should be [5, 3, 1]', () => {
        expect(Arrays.equals(Arrays.range(5, 1, 2), [5, 3, 1])).toBeTruthy()
    })

    test('range from 5, 1 by -2 should be [5, 3, 1]', () => {
        expect(Arrays.equals(Arrays.range(5, 1, -2), [5, 3, 1])).toBeTruthy()
    })
})