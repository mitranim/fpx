## Dict

Utils for dealing with dictionaries (typically called "objects") and object properties. Like all other `fpx` functions, they treat their arguments as immutables and never modify them.

---

### `get(value, key)`

Reads property `key` from `value`. Similar to the bracket notation:
`value[key]`. Advantages over the bracket notation: safe to use on `null` or
`undefined` values, compatible with function composition.

```js
get()
// undefined

get(null, 'one')
// undefined

get({one: 1}, 'one')
// 1

get('string', 'length')
// 6
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

Like `scan` but expects the entire `path` as the second argument.

```js
getIn(1, [])
// 1

getIn({one: {two: 2}}, ['one', 'two'])
// 2
```

---

### `getAt(path, value)`

Like `getIn` but expects the entire `path` as the _first_ argument. Sometimes useful with higher-order functions when path is known in advance.

```js
getAt([], 1)
// 1

getAt(['one', 'two'], {one: {two: 2}})
// 2

const readTwo = bind(getAt, ['one', 'two'])

readTwo({one: {two: 2}})
// 2
```

---

### `mapVals(dict, fun)`

where `fun = ƒ(value: any, key: string) -> any`

Creates a dict with the same keys as `dict`, transforming values via `fun`.

Same as lodash's `_.mapValues`.

```js
mapDict({ping: 'ping', pong: 'pong'}, function bang(a) {return a + '!'})
// {ping: 'ping!', pong: 'pong!'}
```

---

### `mapKeys(dict, fun)`

where `fun = ƒ(key: string, value: any) -> string`

Like [`mapVals`](#-mapvals-dict-fun-), but alters keys rather than values.

Similar to lodash's `_.mapKeys`, but the mapper function receives `key, value` rather than `value, key`.

```js
mapKeys({one: 10, two: 20}, (key, _value) => key[0])
// {o: 10, t: 20}
```

----
