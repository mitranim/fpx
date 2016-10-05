---

## Misc

Uncategorised utils.

---

### `id(value)`

Identity function: returns its argument unchanged. Useful in boolean contexts.

```js
id('first', 'second', 'third')
// 'first'
```

---

### `di(_, value)`

Returns its _second_ argument unchanged. Useful in function composition contexts.

```js
di('first', 'second', 'third')
// 'second'
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

### `maskBy(pattern, value)`

Overlays `pattern` on `value`. The nature of the result depends on the provided
pattern.

```js
// function -> apply as-is

maskBy(isNumber, x)        =  isNumber(x)

// primitive -> replace value

maskBy(null, x)            =  null
maskBy(1, x)               =  1
maskBy(NaN, x)             =  NaN

// regex -> call `RegExp.prototype.test`

maskBy(/blah/, x)          =  /blah/.test(x)

// list -> map to corresponding input properties, masking them

maskBy([], x)              =  []
maskBy([/blah/], x)        =  [/blah/.test(get(x, 0))]
maskBy([/blah/, 'c'], x)   =  [/blah/.test(get(x, 0)), 'c']

// dict -> map to corresponding input properties, masking them

maskBy({}, x)              =  {}
maskBy({one: /blah/}, x)   =  {one: /blah/.test(get(x, 'one'))}
maskBy({two: isArray}, x)  =  {two: isArray(get(x, 'two'))}
maskBy({a: {b: 'c'}}, x)   =  {a: {b: 'c'}}
```

### `mask(pattern)`

`curry1`-version of [`maskBy`](#-maskby-pattern-value-). Takes a pattern and
returns a function that overlays that pattern on any value.

```js
mask(isNumber)        =  isNumber

mask(null)            =  val(null)
mask(1)               =  val(1)
mask(NaN)             =  val(NaN)

mask(/blah/)          =  x => /blah/.test(x)

mask([])              =  _ => []
mask([/blah/])        =  x => [/blah/.test(get(x, 0))]
mask([/blah/, 'c'])   =  x => [/blah/.test(get(x, 0)), 'c']

mask({})              =  _ => ({})
mask({one: /blah/})   =  x => ({one: /blah/.test(get(x, 'one'))})
mask({two: isArray})  =  x => ({two: isArray(get(x, 'two'))})
mask({a: {b: 'c'}})   =  x => ({a: {b: 'c'}})
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

Convenient and minification-friendly way to assert values.

```js
validate(isFunction, x => x)
// undefined

validate(isFunction, 1)
// Uncaught Error: Expected 1 to satisfy test isFunction
```

---

### `validateEach(test, list)`

Same as `validate` but asserts each value in the provided `list`.

```js
validateEach(isFunction, [x => x])
// undefined

validateEach(isFunction, [1])
// Uncaught Error: Expected 1 at index 0 to satisfy test isFunction
```
