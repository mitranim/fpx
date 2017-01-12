## Coll

Utils for dealing with collections (lists and dicts).

---

### `keys(value)`

Like `Object.keys` but safe to use on primitives.

Same as lodash's `_.keys`.

```js
keys()
// []

keys({one: 1, two: 2})
// ['one', 'two']

keys(keys)
// []
```

---

### `values(value)`

Returns the values of all properties of `value` as a list. Safe to use on primitives.

Same as lodash's `_.values`.

```js
values()
// []

values({one: 1, two: 2})
// [1, 2]

values(values)
// []
```

---

### `size(value)`

Depends on `value`'s type:
  * [`isList`](#-islist-value-) → length
  * [`isObject`](#-isobject-value-) → number of [`keys`](#-keys-value-)
  * primitive or function → `0`

Safe to use on primitives.

```js
size([10, 20])
// 2

size({one: 1, two: 2})
// 2

size()
// 0

size(size)
// 0
```

----
