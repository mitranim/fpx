## Misc

Uncategorised utils.

---

### `id(value)`

Identity function: returns its first argument unchanged. Sometimes useful in function composition.

```js
id('first', 'second', 'third')
// 'first'
```

---

### `di(_, value)`

Returns its _second_ argument unchanged. Sometimes useful in function composition.

```js
di('first', 'second', 'third')
// 'second'
```

---

### `val(value)`

"Constant" function. Returns a function that always returns the original value. Useful for dealing with functional APIs when values are known in advance.

Equivalent to lodash's `_.constant`.

```js
const one = val(1)

one()
// 1

one(100)
// 1
```

---

### `maskBy(value, pattern)`

Overlays `pattern` on `value`. The nature of the result depends on the provided
pattern.

Rules:

```js
// function -> apply as-is

maskBy(x, isNumber)        =  isNumber(x)

// primitive -> replace value

maskBy(x, null)            =  null
maskBy(x, 1)               =  1
maskBy(x, NaN)             =  NaN

// regex -> call `RegExp.prototype.test`

maskBy(x, /blah/)          =  /blah/.test(x)

// list -> map to corresponding input properties, masking them

maskBy(x, [])              =  []
maskBy(x, [/blah/])        =  [/blah/.test(get(x, 0))]
maskBy(x, [/blah/, 'c'])   =  [/blah/.test(get(x, 0)), 'c']

// dict -> create an extended version, masking known properties

maskBy(x, {})              =  {}
maskBy(x, {a: {b: 'c'}})   =  {a: {b: 'c'}}
maskBy(x, {one: /blah/})   =  {one: /blah/.test(get(x, 'one'))}
maskBy(x, {two: isArray})  =  {two: isArray(get(x, 'two'))}
```

### `mask(pattern)`

Takes a pattern and returns a version of [`maskBy`](#-maskby-pattern-value-) bound to that pattern. See rules above.

```js
mask(pattern)
// Same as: x => maskBy(x, pattern)
```

---

### `noop`

Empty function. Functional equivalent of `;` or `undefined`. Sometimes useful in function composition.

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

### `validate(value, test)`

where `test = ƒ(any) -> boolean`

Minification-friendly assertion. If `!test(value)`, throws an exception with a message including `value` and the name of the `test` function.

```js
validate({}, isObject)

validate('blah', isFunction)
// Uncaught Error: Expected 1 to satisfy test isFunction
```

---

### `validateEach(list, test)`

Same as `validate` but asserts each value in the provided `list`. Includes the list index in the error message.

```js
validateEach([isFunction], isFunction)

validateEach(['blah'], isFunction)
// Uncaught Error: Expected blah at index 0 to satisfy test isFunction
```

----
