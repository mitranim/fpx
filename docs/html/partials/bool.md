## Bool

Boolean tests.

---

### `truthy(value)`

Aliases: `truthy`, `bool`.

Same as `!!`.

```js
truthy(null)
// false

truthy(1)
// true
```

---

### `falsy(value)`

Aliases: `falsy`, `negate`.

Same as `!`.

```js
falsy(null)
// true

falsy(1)
// false
```

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
isFinite('1') || isFinite(NaN)
// false
```

---

### `isInteger(value)`

True if `value` is an integer: finite without a fractional part.

```js
isInteger(0)
// true
isInteger(1)
// true
isInteger(-1)
// true
isInteger(1.1) || isInteger('1')
// false
```

---

### `isNatural(value)`

True if `value` is a natural number: a positive integer, starting with `0`.

```js
isNatural(0)
// true
isNatural(1)
// true
isNatural(-1) || isNatural(1.1) || isNatural('1')
// false
```

---

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

True if `value` has the type `'object'` and isn't `null`. This includes plain
dicts, arrays, regexes, user-defined "classes", built-in classes, and so on.
Doesn't count functions as objects, even though _technically_ they are.

Note: this is _not_ equivalent to lodash's `_.isObject`, which counts functions
as objects. See [`isComplex`](#-iscomplex-value-) for that.

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

### `isComplex(value)`

Definition:

```js
const isComplex = or(isObject, isFunction)
```

This includes all objects in the true JavaScript sense. Functions are
technically objects, as they have properties and may be mutated.

---

### `isPrimitive(value)`

Definition:

```js
const isPrimitive = not(isComplex)
```

This includes:
  * numbers
  * strings
  * booleans
  * symbols
  * `null` and `undefined`

---

### `isDict(value)`

Aliases: `isDict`, `isPlainObject`.

True if `value` is a normal, honest-to-goodness dictionary and not something
fancy-shmancy.

```js
isDict({})
// true

isDict(Object.create(null))
// true

isDict(Object.create({}))
// false

isDict([])
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
like an ES2015
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise" target="_blank">`Promise`</a>.
The value doesn't have to belong to any specific promise implementation, native or otherwise.

```js
isPromise(Promise.resolve('test'))
// true

isPromise({then () {}, catch () {}})
// true

isPromise({then () {}})
// false
```

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

testBy(inc, 10)            =  11

// primitive -> test for identity via `is`

testBy(null, x)            =  is(null, x)
testBy(1, x)               =  is(1, x)
testBy(NaN, x)             =  is(NaN, x)

// regex -> call `RegExp.prototype.test`

testBy(/blah/, x)          =  /blah/.test(x)

// list ->
//   checks that input is a list
//   each property tests the corresponding input property

testBy([], x)              =  isList(x)
testBy([/blah/], x)        =  isList(x) && /blah/.test(x[0])
testBy([/blah/, 'c'], x)   =  isList(x) && /blah/.test(x[0]) && is(x[1], 'c')

// dictionary ->
//   checks that input is a dict
//   each property tests the corresponding input property

testBy({}, x)              =  isObject(x)
testBy({one: /blah/}, x)   =  isObject(x) && /blah/.test(x.one)
testBy({two: isArray}, x)  =  isObject(x) && isArray(x.two)
testBy({a: {b: 'c'}}, x)   =  isObject(x) && isObject(x.a) && is(x.a.b, 'c')
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

---

### `testAnd(...patterns)`

Converts each pattern to a [`test`](#-test-pattern-) and composes them with
[`and`](#-and-funs-). The resulting function will test its argument against
each pattern and decide if it matches all of them.

```js
const x = testAnd(isString, /10/)

/10/.test(1001)
// true

x(1001)
// testBy(isString, 1001)  =  false

x('1001')
// testBy(isString, '1001') && testBy(/10/, '1001')  =  true
```

---

### `testOr(...patterns)`

Converts each pattern to a [`test`](#-test-pattern-) and composes them with
[`or`](#-or-funs-). The resulting function will test its argument against
each pattern and decide if it matches some of them.

```js
const x = testOr(truthy, 0)

x(null)
// testBy(truthy, null) || testBy(0, null)  =  false

x(1)
// testBy(truthy, 1)  =  false

x(0)
// testBy(truthy, 0) || testBy(0, 0)  =  true
```

---

### `testArgsAnd(...patterns)`

Similar to [`testAnd`](#-testand-patterns-) but applies tests _positionally_:
first pattern to first argument, second pattern to second argument, and so on.
The resulting function returns `true` if every pattern matches its argument, and
`false` otherwise.

```js
const x = testArgsAnd(isFinite, isFinite)

x(10, Infinity)
// testBy(isFinite, 10) && testBy(isFinite, Infinity)  =  false

x(10, 20)
// testBy(isFinite, 10) && testBy(isFinite, 20)  =  true
```

---

### `testArgsOr(...patterns)`

Similar to [`testOr`](#-testor-patterns-) but applies tests _positionally_:
first pattern to first argument, second pattern to second argument, and so on.
The resulting function returns `true` if at least one pattern matches its
argument, and `false` otherwise.

```js
const x = testArgsOr(isFinite, /test/)

x(null, 100)
// testBy(isFinite, null) || testBy(/test/, 100)  =  false

x(10, 100)
// testBy(isFinite, 10)  =  true

x(null, 'test')
// testBy(isFinite, null) || testBy(/test/, 'test')  =  true
```

----
