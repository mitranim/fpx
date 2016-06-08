---

## Misc

Uncategorised utils.

---

### `id(value)`

Identity function: returns its argument unchanged. Useful in boolean contexts.

```js
id(1)
// 1
```

---

### `val(value)`

"Constant" function. Returns a function that always returns the passed value.
Useful for dealing with functional APIs when values are known in advance.

Equivalent to lodash's `_.constant`.

```js
const one = val(1)

one()
// 1

one(100)
// 1
```

---

### `mask(pattern)`

Returns a function that overlays `pattern` on any value. The nature of the
result depends on the provided pattern.

A function is already a mask:

```js
mask(isNumber)  =  isNumber
```

A primitive becomes a function that always returns that primitive:

```js
mask(null)    =  val(null)
mask(1)       =  val(1)
mask(NaN)     =  val(NaN)
mask(false)   =  val(false)
mask('mask')  =  val('mask')
```

A regex produces a regex test:

```js
mask(/blah/)  =  x => /blah/.test(x)
```

An object produces a mask that treats properties as masks in their own right
(recursively), overlaying them and hiding other properties.

```js
mask({})               =  _ => ({})
mask({one: /one!11/})  ≈  x => ({one: /one!11/.test(get(x, 'one'))})
mask({two: isArray})   ≈  x => ({two: isArray(get(x, 'two'))})
mask({a: {b: 'c'}})    ≈  x => ({a: {b: 'c'}})
```

---

### `noop`

Empty function. Functional equivalent of `;` or `undefined`. Useful in
composition contexts.

```js
noop()
// undefined

ifthen(a, b) = ifelse(a, b, noop)
```

---

### `rethrow(val)`

Same as `throw` but can be used as an expression or composed with other funs.

```js
// Expression
const x = someTest ? someValue : rethrow(Error('unreachable'))

// Composition
Promise.reject(Error('fail')).catch(pipe(log, rethrow))
```

---

### `validate(test, value)`

If `value` doesn't satisfy the provided `test` function, raises an exception
with a message including `test`'s name and the failing value.

Convenient and minification-friendly way to assert values. Used internally for
most assertions. Exported because why not.

```js
validate(isFunction, x => x)
// undefined

validate(isFunction, 1)
// Uncaught Error: Expected 1 to satisfy test isFunction
```

---

### `validateEach(test, list)`

Same as `validate` but asserts each value in the provided `list`. Used
internally for multi-argument assertions.

```js
validateEach(isFunction, [x => x])
// undefined

validateEach(isFunction, [1])
// Uncaught Error: Expected 1 at index 0 to satisfy test isFunction
```
