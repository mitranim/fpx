## Misc

Uncategorised utils.

---

### `id(value)`

Identity function: returns its first argument unchanged. Sometimes useful with higher-order functions.

```js
id('first', 'second', 'third')
// 'first'
```

---

### `di(_, value)`

Returns its _second_ argument unchanged. Sometimes useful with higher-order functions.

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

Empty function. Functional equivalent of `;` or `undefined`. Sometimes useful with higher-order functions.

```js
noop()
// undefined

ifthen(a, b) = ifelse(a, b, noop)
```

---

### `rethrow(value)`

Same as `throw` but can be used as an expression. Also sometimes useful with higher-order functions.

```js
// Expression
const x = someTest ? someValue : rethrow(Error('unreachable'))

// Composition
Promise.reject(Error('fail')).catch(pipe(log, rethrow))
```

---

### `show(value)`

Returns a string describing the value. Prints plain data as JSON to avoid the dreaded `[Object object]`. Convenient for interpolation into error messages. Used internally in [`validate`](#-validate-value-test-).

```js
show(10)
// '10'

show(show)
// <source code>

const someData = {one: 1, two: 2}

show(someData)
// same as JSON.stringify(someData)
```

---

### `validate(value, test)`

where `test = ƒ(any) -> boolean`

Minification-friendly assertion. If `!test(value)`, throws an exception with a message including `value` and the name of the test function.

Since the assertion doesn't contain any strings, it can be minified to just a few characters. May depend on how your module bundler handles imports.

```js
validate({}, isObject)
// ok

validate('blah', isFunction)
// Uncaught Error: Expected blah to satisfy test isFunction
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
