---

## Coll

Utils for dealing with collections (lists and dicts).

---

### `keys(value)`

Like `Object.keys` but safe to use on non-objects.

```js
keys()
// []

keys({one: 1, two: 2})
// ['one', 'two']
```

---

### `size(value)`

Returns the length of a list (via [`isList`](#-islist-value-), which excludes
strings), or the number of [`keys`](#-keys-value-) in the given value.

```js
size()
// 0

size([10, 20])
// 2

size({one: 1, two: 2})
// 2
```
