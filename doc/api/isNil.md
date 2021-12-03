True for `null` and `undefined`. Same as `value == null`. Incidentally, these are the only values that produce an exception when attempting to read a property: `null.someProperty`.

```js
// Definition
function isNil(value) {return value == null}

f.isNil(null)
// true

f.isNil(undefined)
// true

f.isNil(false)
// false
```
