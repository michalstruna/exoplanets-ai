# Native

Module for work with browser, hardware, HTML, DOM events and native data types.

* [Arrays](#arrays)
  * [Arrays.findLastIndex()](#arrays-find-last-index)
* [Predicate](#predicate)
* [Validator](#validator)
  * [Validator.BiPredicate](#validator-predicate)
  * [Validator.is()](#validator-is)
  * [Validator.is2()](#validator-is2)
  * [Validator.compare()](#validator-compare)
  * [Validator.safe()](#validator-safe)
  * [Validator.isEmail()](#validator-is-email)
  * [Validator.isUrl()](#validator-is-url)
  * [Validator.Predicate](#validator-predicate)

## Arrays

Utils for arrays.

#### <a name="arrays-find-last-index">`Arrays.findLastIndex<T>(items: T[], predicate: Predicate<T>): number`</a>

Method that returns index of last item that matches predicate.

```
Validator.findLastIndex([1, 2, 3, 4, 5], x < 5) // 3
```

## Validator

Module that can check validity of data against custom predicate or compare values with custom relation.

#### <a name="validator-bi-predicate">`Validator.BiPredicate`</a>

Type of bi predicate.

```
type Predicate<T> = (value1: T, value2: T) => boolean
```

#### <a name="validator-is">`Validator.is<T>(value: T, predicate: Predicate<T>): boolean`</a>

Method that test value against predicate.

```
Validator.is(5, 5) // True, 5 is 5.
Validator.is(5, [3, 4, 5, 6]) // True, 5 is one of 3, 4, 5, or 6.
Validator.is(5, /^[0-9]$/) // True, 5 matches /^[0-9]$/.
Validator.is(5, x => x < 3) // False, 5 is not lower than 3.
```

#### <a name="validator-is2">`Validator.is2<T>(value1: T, value2: T, predicate: BiPredicate<T>): boolean`</a>

Method that test pair of values against predicate.

```
Validator.is('A', 'B', (x, y) => x + y === 'AB') // True, 'A' + 'B' is 'AB'.
Validator.is(5, 10, (x, y) => x > 5 && y > 5) // False, 5 is not higher than 5.
```

#### <a name="validator-compare">`Validator.compare<T extends string | number>(value1: T, relation: Relation, value2: T)`</a>

Method that compare two values with relation.

```
Validator.compare('A', Validator.Relation.Equals, 'B') // False, 'A' does not equals 'B'.
Validator.compare('Abcd', Validator.Relation.Contains, 'bc') // True, 'Abcd' contains 'Ab'.
```

#### <a name="validator-safe">`Validator.safe<T>(value: T, Predicate<T>, defaultValue: T): T`</a>

Method that returns value if value matches predicate, otherwise returns default value.

```
Validator.safe('G', ['A', 'B', 'C'], 'A') // A, because 'G' does not match predicate.
Validator.safe(5, x => x > 1, 2) // 5, because x is higher than 1.
```

#### <a name="validator-is-email">`Validator.isEmail(value: string): boolean`

Method that check if value is email.

```
Validator.isEmail('a@b.com') // True
Validator.isEmail('a@b') // False
```

#### <a name="validator-is-url">`Validator.isUrl(value: string): boolean`

Method that check if value is URL.

```
Validator.isUrl('/tmp/file') // False
Validator.isUrl('http://google.com') // True
```

#### <a name="validator-predicate">`Validator.Predicate`</a>

Type of predicate. It can be value, array of values, regexp or custom function.

```
type Predicate<T> = T | T[] | ((value: T) => boolean) | RegExp
```