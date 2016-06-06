## Object

Utils for dealing with properties and property maps.

{{include('partials/toc-object.md')}}

### `get(value, key)`

Reads property `key` on `value`. Unlike dot or bracket notation, this is safe to
use on `null` or `undefined` values.

```js
get()
// undefined

get(null, 'one')
// undefined

get({one: 1}, 'one')
// 1

get('str', 'length')
// 3
```

### `scan(value, ...path)`

Like `get` but takes many keys and reads a nested property at that path.

```js
scan()
// undefined

scan(null)
// null

scan(null, 'one')
// undefined

scan({one: 1}, 'one')
// 1

scan({one: {two: 2}}, 'one', 'two')
// 2
```

### `getAt(value, path)`

Like `scan` but expects `path` as the second argument. Useful in function
composition contexts or when `path` is coming from another source.

```js
getAt(1, [])
// 1

getAt({one: {two: 2}}, ['one', 'two'])
// 2
```

### `mapVals(fun, value)`

Similar to lodash's `_.mapValues`. Maps `value` to an object with the same
properties, transforming their values via `fun`.

```js
function bang (a) {
  return a + '!'
}

mapVals(bang, {ping: 'ping', pong: 'pong'})
// {ping: 'ping!', pong: 'pong!'}
```

### `mapKeys(fun, value)`

Like [`mapVals`](#-mapvals-fun-value-), but alters keys rather than values.

Similar to lodash's `_.mapKeys`.

```js
mapKeys(last, {one: 'one', two: 'two'})
// {e: 'one', o: 'two'}
```
