# Routing

This module contains all components and methods for work with url.

* [Hash](#hash)
* [History](#history)
* [\<Link /\>](#link)
  * [Link.ACTIVE](#link-active)
* [LinkData](#link-data)
* [Location](#location)
* [Query](#query)
* [QuerySet](#query-set)
* [Target](#target)
* [Url](#url)
* [Urls](#urls)
  * [Urls.push()](#urls-push)
  * [Urls.replace()](#urls-replace)
  * [Urls.merge()](#urls-merge)
  * [Urls.safePath()](#urls-safe-path)
  * [Urls.safeQuery()](#urls-safe-query)
  * [Urls.safeHash()](#urls-safe-hash)
  * [Urls.isCurrent()](#urls-is-current)
  
## Hash

Enum with all hash values used in app.

## History

History of browser used in app. It should be passed to router.

```
<BrowserRouter history={History} />
```

## <a name="link"></a>\<Link /\>

Component for change URL from UI. Link for current url is selectable by `Link.ACTIVE` CSS selector.

```typescript jsx
<Link
    hash={Hash.BOOKS}
    query={{ [Query.LIMIT]: undefined, [Query.FILTER]: 'Hemingway' }}
    url={Url.DATABASE} />
```

### Props

#### `hash?: string`

Hash parameter.

#### `query?: QuerySet`

Object of query params, that will be changed by `Link`. All the others query params will not change. If you want to delete existing query, use `undefined` value. If you want to use empty query param, use `null` value. 

#### `path?: Url`

New pathname. If pathname is external, `target='_blank'` will be used. Change `path` will not change `query` or current `hash`.

### Attributes

#### <a name="link-active"></a>`Link.ACTIVE: string`

CSS selector for link to current page.

## <a name="link-data">LinkData</a>

```typescript
interface LinkData extends Target {
    text: string
}
```

## <a name="location">Location</a>

```typescript
interface Location {
    hash: string
    pathname: string
    search: string
}
```

## <a name="query">Query</a>

Enum with all query parameters used in app.

## <a name="query-set">QuerySet</a>

```typescript
type QuerySet = Record<string, string | number | null>
```

## <a name="target">Target</a>

```typescript
interface Target extends Omit<Partial<Location>, 'search'> {
    query?: QuerySet
}
```

## <a name="url">Url</a>

Enum with all urls used in app.

## <a name="urls">Urls</a>

Class utils for work with url.

### Methods

#### <a name="urls-push">`Urls.push(location: Target): void`</a>

Add `location` to browser history.

#### <a name="urls-replace">`Urls.replace(location: Target): void`</a>

Replace last location in browser history by `location`.

#### <a name="urls-merge">`Urls.merge(location: Location, changes: Target): Location`</a>

Merge `location` to `changes` and return it.

```
const current = { pathname: '/login', search: 'param=value&param2=value2' }
const changes = { path: '/', query: { param3: value3, param2: null } }
const newLocation = Url.merge(current, changes)
// { pathname: '/', search: 'param=value&param3=value3' }
```

#### <a name="urls-safe-path">`Urls.safePath(pathParamName: string, predicate: Validator.Predicate, defaultValue: string): void`</a>

Check if current hash match `predicate`. If not, set `defaultValue`.

#### <a name="urls-safe-query">`Urls.testQuery(queryName: string, predicate: Validator.Predicate, defaultValue: string): void`</a>

Check if current path parameter with `pathParamName` match `predicate`. If not, set `defaultValue`.

#### <a name="urls-safe-hash">`Urls.safeHash(predicate: Predicate, defaultValue: string): void`</a>

Check if current query param with `queryName` name match `predicate`. If not, set `defaultValue`.

#### <a name="urls-is-current">`Urls.isCurrent(source: Location, target: Target): boolean`</a>

Check if `target` refers to the same URL as `source`.