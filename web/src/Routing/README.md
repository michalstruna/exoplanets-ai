# Routing

This module contains all components and methods for work with url.

* [Hash](#hash)
* [History](#history)
* [\<Link /\>](#link)
  * [Link.ACTIVE](#link-active)
* [LinkData](#link-data)
* [Location](#location)
* [Queries](#queries)
  * [Queries.set()](#queries-set)
  * [Queries.get()](#queries-get)
  * [Queries.has()](#queries-has)
  * [Queries.remove()](#queries-remove)
  * [Queries.merge()](#queries-merge)
  * [Queries.parse()](#queries-parse)
  * [Queries.toString()](#queries-to-string)
  * [Queries.isCurrent()](#queries-is-current)
* [Query](#query)
* [QuerySet](#query-set)
* [\<Route /\>](#route)
* [Target](#target)
* [Url](#url)
* [Urls](#urls)
  * [Urls.push()](#urls-push)
  * [Urls.replace()](#urls-replace)
  * [Urls.merge()](#urls-merge)
  * [Urls.testHash()](#urls-test-hash)
  * [Urls.testPath()](#urls-test-path)
  * [Urls.testQuery()](#urls-test-query)
  * [Urls.isCurrent()](#urls-is-current)
  
## Hash

Enum with all hash values used in app.

## History

History of browser used in app. It should be passed to router.

```
<BrowserRouter history={History} />
```

## <a name="link">\<Link /\></a>

