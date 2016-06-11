---

## Bool

Boolean tests.

---

### `is(one, other)`

Like `===` but considers `NaN` equal to itself.
Also known as
<a href="http://www.ecma-international.org/ecma-262/6.0/#sec-samevaluezero" target="_blank">`SameValueZero`</a>.
Used internally for primitive equality tests.

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

True if `value` is a normal, honest-to-goodness object and not something
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
_doesn't_ include strings, as JavaScript strings can't be broken down into
non-list elements.

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

### `test(pattern)`

Provides a limited form of pattern testing. Together with ES2015 destructuring,
it lets you crudely approximate pattern matching, a feature common in functional
languages but missing from JavaScript.

Returns a function that checks a value against the pattern. The nature of the
function depends on the provided pattern.

A function is already a test:

```js
test(isNumber)  =  isNumber
```

A primitive produces an exact equality test via [`lang/is`](api/lang/#-is-one-other-):

```js
test(null)    =  x => is(x, null)
test(1)       =  x => is(x, 1)
test(NaN)     =  x => is(x, NaN)
test(false)   =  x => is(x, false)
test('test')  =  x => is(x, 'test')
```

A regex produces a regex test:

```js
test(/blah/)  =  x => /blah/.test(x)
```

A dictionary produces a fuzzy test. Its properties become tests in their own
right (recursively). When testing a value, its properties must match all of
these tests.

```js
test({})               =  x => isObject(x)
test({one: /oen!11/})  =  x => isObject(x) && /oen!11/.test(x.one)
test({two: isArray})   =  x => isObject(x) && isArray(x.two)
test({a: {b: 'c'}})    =  x => isObject(x) && isObject(x.a) && is(x.a.b, 'c')
```

Using `test` and ES2015 destructuring to approximate pattern matching:

```js
const {test, ifthen, isNumber} = require('fpx')

// Definition

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
