## Bool

Boolean tests.

---

### `truthy(value)`

Aliases: `truthy`, `bool`.

Same as `!!` or `Boolean`. Sometimes useful with higher-order functions.

```js
truthy(null)
// false

truthy(1)
// true
```

---

### `falsy(value)`

Aliases: `falsy`, `negate`.

Same as `!`. Sometimes useful with higher-order functions.

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

Used by `fpx` for all identity tests. When comparing unknown values, you should prefer this to `===`.

```js
is(1, '1')
// false

is(NaN, NaN)
// true
```

---

### `isNumber(value)`

Same as `typeof value === 'number'`. Returns `true` for `NaN` and `Infinity`.
In most cases, you should use `isFinite` instead.

```js
isNumber(1)
// true
isNumber('1')
// false
isNumber(NaN)
// true <-- WTF
```

---

### `isFinite(value)`

Same as ES2015's
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite" target="_blank">`Number.isFinite`</a>.

Returns `true` if `value` is a number and is _not_ `NaN` or `Infinity`. In most cases, you should prefer this to `isNumber`.

```js
isFinite(1)
// true
isFinite('1')
// false
isFinite(NaN)
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
isInteger(1.1)
// false
isInteger('1')
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
isNatural(-1)
// false
isNatural(1.1)
// false
isNatural('1')
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

### `isInfinity(value)`

True if `value` is `-Infinity` or `Infinity`.

```js
isInfinity(Infinity)
// true
isInfinity(-Infinity)
// true
isInfinity(10)
// false
isInfinity(NaN)
// false
isInfinity(undefined)
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

### `isPrimitive(value)`

Opposite of `isComplex`. True for:

  * numbers
  * strings
  * booleans
  * symbols
  * `null` and `undefined`

---

### `isComplex(value)`

Definition:

```js
function isComplex(value) {
  return isObject(value) || isFunction(value)
}
```

This includes all "objects" in the true JavaScript sense. Functions are
technically objects, as you can assign properties to them.

---

### `isInstance(value, Class)`

Same as `instanceof` but avoids unnecessary allocations. `instanceof` has a problem: when the left operand is a primitive, even though `instanceof` is guaranteed to return `false`, it creates a temporary wrapper object, wasting performance. `isInstance` avoids this mistake.

```js
isInstance([], Array)          // true
isInstance(new Date(), Date)   // true
isInstance(1, Number)          // false, but the call is free
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
_doesn't include strings_.

```js
isList([])
// true

const args = function () {return arguments}()
isList(args)
// true

isList(document.querySelectorAll('div'))
// true

isList('string')
// false
```

---

### `isRegExp(value)`

```js
isRegExp(/blah/)
// true
```

---

### `isDate(value)`

```js
isDate(new Date())             // true
isDate(new Date().toString())  // false
```

---

### `isValidDate(value)`

```js
isDate(new Date())     // true
isDate(new Date(NaN))  // false
```

---

### `isInvalidDate(value)`

```js
isDate(new Date())     // false
isDate(new Date(NaN))  // true
```

---

### `isPromise(value)`

True if the value
<a href="https://en.wikipedia.org/wiki/Duck_test" target="_blank">quacks</a>
like an ES2015
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator" target="_blank">iterator</a>. _Iterators_, also called _generator objects_, are created by calling a _generator function_.

```js
function* myGenerator() {
  yield 10
  yield 20
  return 30
}

isIterator(myGenerator())
// true

isIterator(myGenerator)
// false
```

---

### `isIterator(value)`

True if the value
<a href="https://en.wikipedia.org/wiki/Duck_test" target="_blank">quacks</a>
like an ES2015
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise" target="_blank">`Promise`</a>.
Works for non-native promise implementations.

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

### `testBy(value, pattern)`

Limited form of pattern testing. Together with ES2015 destructuring, it lets you
crudely approximate pattern matching, a feature common in functional languages
but missing from JavaScript.

Tests `value` against `pattern`. The nature of the test depends on the provided
pattern.

Rules:

```js
// function -> apply as-is

testBy(10, inc)            =  11

// primitive -> test for identity via `is`

testBy(x, null)            =  is(x, null)
testBy(x, 1)               =  is(x, 1)
testBy(x, NaN)             =  is(x, NaN)

// regex -> call `RegExp.prototype.test`

testBy(x, /blah/)          =  /blah/.test(x)

// list ->
//   checks that input is a list
//   each property tests the corresponding input property

testBy(x, [])              =  isList(x)
testBy(x, [/blah/])        =  isList(x) && /blah/.test(x[0])
testBy(x, [/blah/, 'c'])   =  isList(x) && /blah/.test(x[0]) && is(x[1], 'c')

// dictionary ->
//   checks that input is a dict
//   each property tests the corresponding input property

testBy(x, {})              =  isObject(x)
testBy(x, {one: /blah/})   =  isObject(x) && /blah/.test(x.one)
testBy(x, {two: isArray})  =  isObject(x) && isArray(x.two)
testBy(x, {a: {b: 'c'}})   =  isObject(x) && isObject(x.a) && is(x.a.b, 'c')
```

### `test(pattern)`

Takes a pattern and returns a version of [`testBy`](#-testby-value-pattern-) bound to that pattern.

```js
test(pattern)
// Same as: x => testBy(x, pattern)
```

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
// testBy(1001, isString)  =  false

x('1001')
// testBy('1001', isString) && testBy('1001', /10/)  =  true
```

---

### `testOr(...patterns)`

Converts each pattern to a [`test`](#-test-pattern-) and composes them with
[`or`](#-or-funs-). The resulting function will test its argument against
each pattern and decide if it matches some of them.

```js
const x = testOr(truthy, 0)

x(null)
// testBy(null, truthy) || testBy(null, 0)  =  false

x(1)
// testBy(1, truthy)  =  false

x(0)
// testBy(0, truthy) || testBy(0, 0)  =  true
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
// testBy(10, isFinite) && testBy(Infinity, isFinite)  =  false

x(10, 20)
// testBy(10, isFinite) && testBy(20, isFinite)  =  true
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
// testBy(null, isFinite) || testBy(100, /test/)  =  false

x(10, 100)
// testBy(10, isFinite)  =  true

x(null, 'test')
// testBy(null, isFinite) || testBy('test', /test/)  =  true
```

----
