import * as Validator from './Validator'

describe('is', () => {
    describe('regexp preficate', () => {
        test('4 should match [0-9]', () => {
            expect(Validator.is(4, /[0-9]/)).toBeTruthy()
        })

        test('12 should  match [0-9]', () => {
            expect(Validator.is(12, /[0-9]/)).toBeTruthy()
        })

        test('12 should not match ^[0-9]$', () => {
            expect(Validator.is(12, /^[0-9]$/)).toBeFalsy()
        })

        test('* should not match [0-9]', () => {
            expect(Validator.is('*', /[0-9]/)).toBeFalsy()
        })
    })

    describe('array predicate', () => {
        test('Abc should match [\'Cde\', \'Abc\', \'Efg\']', () => {
            expect(Validator.is('Abc', ['Cde', 'Abc', 'Efg'])).toBeTruthy()
        })

        test('Abc should match [\'Cde\', \'Ab\', \'Efg\']', () => {
            expect(Validator.is('Abc', ['Cde', 'Ab', 'Efg'])).toBeFalsy()
        })

        test('Nothing should not match [\'A\', \'B\', \'C\']', () => {
            expect(Validator.is('Abc', ['Cde', 'Ab', 'Efg'])).toBeFalsy()
        })
    })

    describe('function predicate', () => {
        test('51 % 45 should match 6', () => {
            expect(Validator.is(51, x => (x % 45) === 6)).toBeTruthy()
        })

        test('typeof true should not match \'string\'', () => {
            expect(Validator.is(true, x => typeof x === 'string')).toBeFalsy()
        })
    })

    describe('value predicate', () => {
        test('7 should match 7', () => {
            expect(Validator.is(7, 7)).toBeTruthy()
        })

        test('\'A\' should not match \'B\'', () => {
            expect(Validator.is('A', 'B')).toBeFalsy()
        })

        test('true should not match false', () => {
            expect(Validator.is(true, false)).toBeFalsy()
        })
    })
})

describe('safe', () => {
    test('safe value should stay', () => {
        expect(Validator.safe(12, [6, 12, 18], 0)).toBe(12)
    })

    test('unsafe value should be replaced', () => {
        expect(Validator.safe('A', ['B', 'C', 'D'], 'Z')).toBe('Z')
    })

    test('undefined value should be replaced', () => {
        expect(Validator.safe(undefined, x => x !== undefined, true)).toBe(true)
    })

    test('undefined value should stay', () => {
        expect(Validator.safe(undefined, x => true, false)).toBe(undefined)
    })
})