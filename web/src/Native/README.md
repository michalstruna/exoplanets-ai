# Native

Module for work with browser, hardware, HTML, DOM events and native data types.

* [Arrays](#arrays)
  * [Arrays.findLastIndex()](#arrays-find-last-index)
* [Cookie](#cookie)
* [LocalStorage](#local-storage)
* [Validator](#validator)
  * [Validator.BiPredicate](#validator-predicate)
  * [Validator.is()](#validator-is)
  * [Validator.is2()](#validator-is2)
  * [Validator.compare()](#validator-compare)
  * [Validator.safe()](#validator-safe)
  * [Validator.isEmail()](#validator-is-email)
  * [Validator.isUrl()](#validator-is-url)
  * [Validator.Predicate](#validator-predicate)
  * [Validator.Relation](#validator-relation)
* [useDrag()](#use-drag)
* [useElement()](#use-element)
* [useEvent()](#use-event)

## Arrays

Utils for arrays.

#### <a name="arrays-find-last-index">`Arrays.findLastIndex<T>(items: T[], predicate: Predicate<T>): number`</a>

Method that returns index of last item that matches predicate.

```
Validator.findLastIndex([1, 2, 3, 4, 5], x < 5) // 3
```

## Cookie

Enum with all cookie keys and expirations [days] used in app.

```
{
    IDENTITY: { name: 'identity', expiration: 30 / 1440 }
}
```

## LocalStorage

Enum with all local storage keys used in app.

```
enum LocalStorage {
    SETTINGS = 'settings'
}
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

#### <a name="validator-relation">`Validator.Relation`</a>

Enum with all relations.

## <a name="use-drag">useDrag()</a>

#### `useDrag<T>(handler: Handler<T>, getData?: DataGetter<T>): Handlers`

```
type Coord = { x: number, y: number }
type Handler<T> = { start: Coord, current: Coord, delta: Coord, data: T | undefined }
type DataGetter<T> = () => T
type EventHandler = (event: React.MouseEvent) => void
type Handlers = { onMouseDown: EventHandler, onMouseMove: EventHandler, onMouseUp: EventHandler, onMouseLeave: EventHandler }
```

Hook implementing drag events. It accepts `handler` in parameter and optionally also `getData` which will be called on beginning of drag. Hook returns record of event handlers that should be passed to props of some element.

```
const dragHandlers = useDrag(({ delta, data }) => {
    container.scrollLeft = data.x - delta.x
    container.scrollTop = data.y - delta.y
}, () => ({ x: container.scrollLeft, y: container.scrollTop }))

<div {...dragHandlers} />
```

## <a name="use-element">useElement</a>

#### `useElement(): Refs`

```
type Refs = { app: RefObject<HTMLElement>, nav: RefObject<HTMLElement> }
```

Hook returns reference to objects that are static and outside of React renderer.

```
const { app } = useElement()
app.current.scrollTop = 0
```

## <a name="use-event">useEvent</a>

#### `useEvent(element: Target, event: string, handler: Handler, options?: Options)`

```
type Target = Element | Window | Document
type Handler = () => void
type Options = {
    immediate?: boolean // If true, event handler will be called immediate.
    active?: boolean // If true, event handler is enabled.
    throttle?: number // Throttle event [ms].
    passive?: boolean // Event will be passive (performance reasons).
}
```

Hook that pass event handler to element and on unmount remove this handler.

```
useEvent(window, 'scroll', () => console.log('SCROLL!'), { throttle: 200 })
```