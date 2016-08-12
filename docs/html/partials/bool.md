---

## Bool

Boolean tests.

---

### `is(one, other)`

Same as ES2015's
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is" target="_blank">`Object.is`</a>. Like `===` but considers `NaN` equal to itself.

Used internally for identity tests. Recommended over `===` in most practical
scenarios.

```js
is(1, '1')
// false

is(NaN, NaN)
// true
```

---

### `isNumber(value)`

```js
isNumber(1)
// true
```

---

### `isFinite(value)`

Same as ES2015's
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite" target="_blank">`Number.isFinite`</a>.

Recommended over `isNumber` in most practical scenarios.

```js
isFinite(1)
// true
isFinite('1')
// false
isFinite(NaN)
// false
```

### `isNaN(value)`

Same as ES2015's
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN" target="_blank">`Number.isNaN`</a>. True if `value` is _really_, strictly `NaN`.
Unlike the old global `isNaN`, doesn't coerce non-numbers.

```js
isNaN(NaN)
// true
isNaN(undefined)
// false
```

---

### `isString(value)`

```js
isString('blah')
// true
```

---

### `isBoolean(value)`

```js
isBoolean(false)
// true
```

---

### `isSymbol(value)`

```js
isSymbol(Symbol('blah'))
// true
```

---

### `isFunction(value)`

```js
isFunction(isFunction)
// true
```

---

### `isObject(value)`

True if `value` has the type `'object'` and isn't `null`. This covers arrays,
regexes, user-defined classes, DOM nodes, and so on. Doesn't consider functions
to be objects, even though technically they are.

```js
isObject('blah')
// false

isObject(/blah/)
// true

isObject([])
// true

isObject(Object.create(null))
// true

isObject(() => {})
// false
```

---

### `isPlainObject(value)`

True if `value` is a normal, honest-to-goodness dictionary and not something
fancy-shmancy.

```js
isPlainObject({})
// true

isPlainObject(Object.create(null))
// true

isPlainObject(Object.create({}))
// false

isPlainObject([])
// false
```

---

### `isArray(value)`

True if `value` inherits from `Array.prototype`.

```js
isArray([])
// true
```

---

### `isList(value)`

True if `value` looks like a linear, ordered list. This includes `arguments`,
`NodeList`s, and so on. Used internally for most list checks. Note that this
_doesn't_ include strings.

```js
isList([])
// true

const args = function () {return arguments}()
isList(args)
// true

isList(document.querySelectorAll('div'))
// true

isList('str')
// false
```

---

### `isRegExp(value)`

```js
isRegExp(/blah/)
// true
```

---

### `isPromise(value)`

True if the value
<a href="https://en.wikipedia.org/wiki/Duck_test" target="_blank">quacks</a>
like an ES2015 promise. The value doesn't have to belong to any specific
`Promise` implementation, native or otherwise.

```js
isPromise(Promise.resolve('test'))
// true

isPromise({then () {}, catch () {}})
// true

isPromise({then () {}})
// false
```

---

### `isPrimitive(value)`

Definition:

```js
not(or(isObject, isFunction))
```

This includes:
  * numbers
  * strings
  * booleans
  * symbols
  * `null` and `undefined`

  ---

### `isNil(value)`

Definition:

```js
function isNil (value) {
  return value == null
}
```

This includes `null` and `undefined`.

---

### `testBy(pattern, value)`

Limited form of pattern testing. Together with ES2015 destructuring, it lets you
crudely approximate pattern matching, a feature common in functional languages
but missing from JavaScript.

Tests `value` against `pattern`. The nature of the test depends on the provided
pattern.

```js
// function -> apply as-is

testBy(inc, 10)       =  11

// primitive -> test for identity via `is`

testBy(null, x)       =  is(null, x)
testBy(1, x)          =  is(1, x)
testBy(NaN, x)        =  is(NaN, x)

// regex -> call `RegExp.prototype.test`

testBy(/blah/, x)     =  /blah/.test(x)

// list ->
//   checks that input is a list
//   each property tests the corresponding input property

test([])              =  isList(x)
test([/blah/])        =  isList(x) && /blah/.test(x[0])
test([/blah/, 'c'])   =  isList(x) && /blah/.test(x[0]) && is(x[1], 'c')

// dictionary ->
//   checks that input is a dict
//   each property tests the corresponding input property

test({})              =  isObject(x)
test({one: /blah/})   =  isObject(x) && /blah/.test(x.one)
test({two: isArray})  =  isObject(x) && isArray(x.two)
test({a: {b: 'c'}})   =  isObject(x) && isObject(x.a) && is(x.a.b, 'c')
```

### `test(pattern)`

`curry1`-version of [`testBy`](#-testby-pattern-value-). Takes a pattern and
returns a function that tests any value against that pattern.

```js
test(isNumber)        =  isNumber

test(null)            =  x => is(x, null)
test(1)               =  x => is(x, 1)
test(NaN)             =  x => is(x, NaN)

test(/blah/)          =  x => /blah/.test(x)

test([])              =  x => isList(x)
test([/blah/])        =  x => isList(x) && /blah/.test(x[0])
test([/blah/, 'c'])   =  x => isList(x) && /blah/.test(x[0]) && is(x[1], 'c')
test({})              =  x => isObject(x)

test({one: /blah/})   =  x => isObject(x) && /blah/.test(x.one)
test({two: isArray})  =  x => isObject(x) && isArray(x.two)
test({a: {b: 'c'}})   =  x => isObject(x) && isObject(x.a) && is(x.a.b, 'c')
```

#### Using Patterns

Using `test` and ES2015 destructuring to approximate pattern matching:

```js
const {test, ifthen, isNumber} = require('fpx')

// Util

function match (pattern, func) {
  return ifthen(test(pattern), func)
}

// Usage

const x = match({type: 'double', value: isNumber}, ({value}) => value * 2)

x('test')
// undefined

x({type: 'double', value: 10})
// 20
```
