## Dict

Utils for dealing with dictionaries ("objects") and properties in general. Like
all other `fpx` functions, they treat their arguments as immutables and never
modify them.

---

### `get(value, key)`

Reads property `key` from `value`. Similar to the bracket notation:
`value[key]`. Advantages over the bracket notation: safe to use on `null` or
`undefined` values; compatible with function composition.

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

---

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

---

### `getIn(value, path)`

Like `scan` but expects the entire `path` as the second argument. Useful when
path is determined dynamically.

```js
getIn(1, [])
// 1

getIn({one: {two: 2}}, ['one', 'two'])
// 2
```

---

### `getAt(path, value)`

Like `getIn` but expects the entire `path` as the _first_ argument. Useful in
function composition contexts when path is known in advance.

```js
getAt([], 1)
// 1

getAt(['one', 'two'], {one: {two: 2}})
// 2

const from = curry1(getAt)

const read = from(['one', 'two'])

read({one: {two: 2}})
// 2
```

---

### `mapDict(fun, dict)`

where `fun = ƒ(value: any, key: string): any`

Creates a dict with the same keys as `dict`, transforming values via `fun`.

Similar to lodash's `_.mapValues`, but with an FP-friendly argument order.

```js
function bang (a) {return a + '!'}

mapDict(bang, {ping: 'ping', pong: 'pong'})
// {ping: 'ping!', pong: 'pong!'}
```

---

### `mapKeys(fun, value)`

where `fun = ƒ(value: any, key: string): any`

Like [`mapDict`](#-mapdict-fun-dict-), but alters keys rather than values.

Similar to lodash's `_.mapKeys`, but with an FP-friendly argument order.

```js
mapKeys(last, {one: 'one', two: 'two'})
// {e: 'one', o: 'two'}
```

----
